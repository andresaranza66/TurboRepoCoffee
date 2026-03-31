import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

//Monthly allos to one per day

export const seedCoffees = mutation({
  args: {},
  handler: async (ctx) => {
    const coffees = [
      {
        name: "Americano",
        price: 3,
        stock: 100,
        description: "Classic americano coffee",
        image: "/americano.png",
      },
      {
        name: "Doble Americano",
        price: 4,
        stock: 100,
        description: "Double shot americano",
        image: "/dobleAmericano.png",
      },
      {
        name: "Latte",
        price: 4.5,
        stock: 100,
        description: "Espresso with milk",
        image: "/lattee.png",
      },
      {
        name: "Capuccino",
        price: 4.5,
        stock: 100,
        description: "Espresso with steamed milk foam",
        image: "/capuchino.png",
      },
      {
        name: "Regular Coffee",
        price: 2.5,
        stock: 100,
        description: "House brewed coffee",
        image: "/regularCoffee.png",
      },
      {
        name: "Seasonal Special",
        price: 5,
        stock: 100,
        description: "Limited seasonal coffee",
        image: "/seasonalCoffee.png",
      },
    ];
    for (const coffee of coffees) {
      console.log(coffee);
      await ctx.db.insert("coffees", coffee);
    }
  },
});

// To get to use the info on my app
export const getMenu = query({
  args: {},
  handler: async (ctx) => {
    // This fetches every single item in the "coffees" table
    return await ctx.db.query("coffees").collect();
  },
});

export const getRecentDrinks = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const take = Math.max(1, Math.min(limit ?? 3, 10));

    // Scan more than `take` so we can skip duplicates and still return `take` unique coffees.
    const scan = Math.max(take * 10, 30);

    const orders = await ctx.db
      .query("orders")
      .withIndex("by_user_date", (q) => q.eq("userId", identity.subject))
      .order("desc")
      .take(scan);

    const seenCoffeeIds = new Set<string>();
    const result: {
      orderId: string;
      createdAt: number;
      coffee: { id: any; name: string; image?: string } | null;
    }[] = [];

    for (const order of orders) {
      if (!order.coffeeId) continue;

      let coffeeIdStr: string;
      try {
        coffeeIdStr = order.coffeeId.toString();
      } catch {
        continue;
      }
      if (seenCoffeeIds.has(coffeeIdStr)) continue;

      let coffee: any | null = null;
      try {
        coffee = await ctx.db.get(order.coffeeId);
      } catch {
        continue;
      }
      seenCoffeeIds.add(coffeeIdStr);

      result.push({
        orderId: order._id,
        createdAt: order.createdAt ?? 0,
        coffee: coffee
          ? {
              id: coffee._id,
              name: coffee.name,
              image: coffee.image,
            }
          : null,
      });

      if (result.length >= take) break;
    }

    return result;
  },
});

export const debugRecentDrinks = query({
  args: { scan: v.optional(v.number()) },
  handler: async (ctx, { scan }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return {
        hasIdentity: false,
        subject: null,
        ordersCount: 0,
        sampleOrderIds: [],
      };
    }

    const take = Math.max(1, Math.min(scan ?? 50, 200));

    const orders = await ctx.db
      .query("orders")
      .withIndex("by_user_date", (q) => q.eq("userId", identity.subject))
      .order("desc")
      .take(take);

    return {
      hasIdentity: true,
      subject: identity.subject,
      ordersCount: orders.length,
      sampleOrderIds: orders.slice(0, 5).map((o) => o._id),
      sampleCoffeeIds: orders.slice(0, 5).map((o) => o.coffeeId),
      sampleTypes: orders.slice(0, 5).map((o) => o.type),
    };
  },
});

export const getMenuByPreference = query({
  args: { maxOrdersToScan: v.optional(v.number()) },
  handler: async (ctx, { maxOrdersToScan }) => {
    const identity = await ctx.auth.getUserIdentity();
    const coffees = await ctx.db.query("coffees").collect();
    if (!identity) return coffees;

    const take = Math.max(1, Math.min(maxOrdersToScan ?? 1000, 5000));

    const orders = await ctx.db
      .query("orders")
      .withIndex("by_user_date", (q) => q.eq("userId", identity.subject))
      .order("desc")
      .take(take);

    const counts = new Map<string, number>();
    for (const order of orders) {
      const key = order.coffeeId.toString();
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }

    return coffees.sort((a, b) => {
      const countA = counts.get(a._id.toString()) ?? 0;
      const countB = counts.get(b._id.toString()) ?? 0;
      if (countA !== countB) return countB - countA;
      return a.name.localeCompare(b.name);
    });
  },
});

// This line is going to be for the part that peoople mutate the state of the

export const orderCoffee = mutation({
  args: {
    coffeeId: v.id("coffees"),
  },
  handler: async (ctx, { coffeeId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    /* ------------------------------------------------ */
    /* 1. Get user                                     */
    /* ------------------------------------------------ */

    const user = await ctx.db
      .query("users")
      .withIndex("by_authId", (q) => q.eq("authId", identity.subject))
      .unique();

    if (!user) throw new Error("User not found");

    if (!user.subscriptionId) {
      throw new Error("No active subscription");
    }

    /* ------------------------------------------------ */
    /* 2. Get coffee                                   */
    /* ------------------------------------------------ */

    const coffee = await ctx.db.get(coffeeId);
    if (!coffee) throw new Error("Coffee not found");

    if (coffee.stock <= 0) {
      throw new Error("Out of stock");
    }

    /* ------------------------------------------------ */
    /* 3. Monthly reset logic                          */
    /* ------------------------------------------------ */

    const currentMonth = new Date().toISOString().slice(0, 7);

    let newCount = (user.drinksCount ?? 0) + 1;
    let drinksMonth = user.drinksMonth;

    if (user.drinksMonth !== currentMonth) {
      newCount = 1;
      drinksMonth = currentMonth;
    }

    /* ------------------------------------------------ */
    /* 4. Atomic updates (same mutation = atomic)      */
    /* ------------------------------------------------ */

    await ctx.db.patch(coffee._id, {
      stock: coffee.stock - 1,
    });

    await ctx.db.patch(user._id, {
      drinksCount: newCount,
      drinksMonth,
      updatedAt: Date.now(),
    });

    await ctx.db.insert("orders", {
      userId: identity.subject,
      coffeeId,
      type: "drink",
      createdAt: Date.now(),
    });

    return { success: true };
  },
});
