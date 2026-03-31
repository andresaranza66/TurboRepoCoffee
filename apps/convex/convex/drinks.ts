import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const consumeDrink = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const today = new Date().toISOString().split("T")[0];

    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");

    if (user.lastDrinkDate === today) {
      throw new Error("Daily drink already used");
    }

    await ctx.db.patch(args.userId, {
      lastDrinkDate: today,
    });

    return { success: true };
  },
});

export const canDrinkToday = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return { canDrink: false };

    const user = await ctx.db
      .query("users")
      .withIndex("by_authId", (q) => q.eq("authId", identity.subject))
      .unique();

    if (!user) return { canDrink: false };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingFree = await ctx.db
      .query("orders")
      .filter((q) =>
        q.and(
          q.eq(q.field("userId"), identity.subject),
          q.eq(q.field("type"), "free"),
          q.gte(q.field("createdAt"), today.getTime()),
        ),
      )
      .first();

    return {
      canDrink: !existingFree,
    };
  },
});

// This is the file where the user would be accessing to the daily free coffee.
export const consumeFreeDailyDrink = mutation({
  args: {
    coffeeId: v.id("coffees"),
  },
  handler: async (ctx, { coffeeId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_authId", (q) => q.eq("authId", identity.subject))
      .unique();

    if (!user) throw new Error("User not found");

    const coffee = await ctx.db.get(coffeeId);
    if (!coffee) throw new Error("Coffee not found");

    if (coffee.stock <= 0) {
      throw new Error("Out of stock");
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingFree = await ctx.db
      .query("orders")
      .filter((q) =>
        q.and(
          q.eq(q.field("userId"), identity.subject),
          q.eq(q.field("type"), "free"),
          q.gte(q.field("createdAt"), today.getTime()),
        ),
      )
      .first();

    if (existingFree) {
      throw new Error("Daily free drink already used");
    }

    await ctx.db.patch(coffeeId, {
      stock: coffee.stock - 1,
    });

    await ctx.db.insert("orders", {
      userId: identity.subject,
      coffeeId,
      type: "free",
      createdAt: Date.now(),
    });

    const currentMonth = new Date().toISOString().slice(0, 7);
    const newCount =
      user.drinksMonth === currentMonth ? (user.drinksCount ?? 0) + 1 : 1;

    await ctx.db.patch(user._id, {
      drinksCount: newCount,
      drinksMonth: currentMonth,
      updatedAt: Date.now(),
    });

    return true;
  },
});

//Comprar el drink the times the user wants.
export const buyDrink = mutation({
  args: {
    coffeeId: v.id("coffees"),
  },
  handler: async (ctx, { coffeeId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_authId", (q) => q.eq("authId", identity.subject))
      .unique();

    if (!user) throw new Error("User not found");

    const coffee = await ctx.db.get(coffeeId);
    if (!coffee) throw new Error("Coffee not found");

    if (coffee.stock <= 0) {
      throw new Error("Out of stock");
    }

    // ✅ Decrease stock
    await ctx.db.patch(coffeeId, {
      stock: coffee.stock - 1,
    });

    // ✅ Create order record
    await ctx.db.insert("orders", {
      userId: identity.subject,
      coffeeId,
      type: "paid",
      createdAt: Date.now(),
    });

    const currentMonth = new Date().toISOString().slice(0, 7);
    const newCount =
      user.drinksMonth === currentMonth ? (user.drinksCount ?? 0) + 1 : 1;

    await ctx.db.patch(user._id, {
      drinksCount: newCount,
      drinksMonth: currentMonth,
      updatedAt: Date.now(),
    });

    return true;
  },
});
