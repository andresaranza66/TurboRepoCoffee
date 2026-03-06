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

    return { success: true };
  },
});
