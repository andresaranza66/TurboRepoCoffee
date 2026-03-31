import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { components } from "./_generated/api";

function base64UrlToBase64(input: string) {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padLength = (4 - (base64.length % 4)) % 4;
  return base64 + "=".repeat(padLength);
}

function decodeBase64(base64: string) {
  // Convex runtime provides atob/btoa.
  return atob(base64);
}

function decodeJwtPayload(token: string): unknown {
  const payloadB64Url = token.split(".")[1];
  if (!payloadB64Url) return null;
  const base64 = base64UrlToBase64(payloadB64Url);
  const json = decodeBase64(base64);
  return JSON.parse(json);
}

/* ------------------------------------------------ */
/* CURRENT USER                                     */
/* ------------------------------------------------ */

export const currentUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    return await ctx.db
      .query("users")
      .withIndex("by_authId", (q) => q.eq("authId", identity.subject))
      .unique();
  },
});

/* ------------------------------------------------ */
/* ENSURE USER (create if not exists)                */
/* ------------------------------------------------ */

export const ensureUser = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return;

    let linked = await ctx.db
      .query("users")
      .withIndex("by_authId", (q) => q.eq("authId", identity.subject))
      .unique();

    if (!linked && identity.email) {
      linked = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", identity.email!))
        .unique();
    }

    if (linked && linked.authId !== identity.subject) {
      const oldAuthId = linked.authId;

      await ctx.db.patch(linked._id, {
        authId: identity.subject,
        updatedAt: Date.now(),
      });

      let cursor: string | null = null;
      for (;;) {
        const page = await ctx.db
          .query("orders")
          .withIndex("by_user", (q) => q.eq("userId", oldAuthId))
          .paginate({
            cursor,
            numItems: 100,
          });

        for (const order of page.page) {
          await ctx.db.patch(order._id, {
            userId: identity.subject,
          });
        }

        if (page.isDone) break;
        cursor = page.continueCursor;
      }

      linked = await ctx.db.get(linked._id);
    }

    let image = (identity as any).image ?? (identity as any).picture ?? undefined;
    let name = (identity as any).name ?? undefined;

    if (!image || !name) {
      const accounts = await ctx.runQuery(components.betterAuth.adapter.findMany, {
        model: "account",
        where: [
          { field: "providerId", operator: "eq", value: "google" },
          { connector: "AND", field: "userId", operator: "eq", value: identity.subject },
        ],
        paginationOpts: {
          cursor: null,
          numItems: 10,
        },
      });

      const googleAccount = accounts?.[0];
      const idToken = googleAccount?.idToken ?? undefined;
      if (idToken) {
        try {
          const payload = decodeJwtPayload(idToken) as
            | { name?: string; picture?: string }
            | null;
          if (payload) {
            if (!name && payload.name) name = payload.name;
            if (!image && payload.picture) image = payload.picture;
          }
        } catch {
          // ignore
        }
      }
    }

    if (!image || !name) {
      const betterAuthUser = await ctx.runQuery(
        components.betterAuth.adapter.findOne,
        {
          model: "user",
          where: [{ field: "_id", operator: "eq", value: identity.subject }],
          select: ["name", "image"],
        },
      );

      if (!name && (betterAuthUser as any)?.name) name = (betterAuthUser as any).name;
      if (!image && (betterAuthUser as any)?.image) image = (betterAuthUser as any).image;
    }

    if (linked) {
      const patch: Record<string, any> = { updatedAt: Date.now() };
      if (identity.email && linked.email !== identity.email) patch.email = identity.email;
      if (name && linked.name !== name) patch.name = name;
      if (image && linked.image !== image) patch.image = image;

      if (Object.keys(patch).length > 1) {
        await ctx.db.patch(linked._id, patch);
      }

      return linked._id;
    }

    return await ctx.db.insert("users", {
      authId: identity.subject,
      email: identity.email ?? "",
      name: name ?? "",
      image,
      createdAt: Date.now(),
      drinksCount: 0,
      drinksMonth: new Date().toISOString().slice(0, 7),
    });
  },
});

// */ADD DRINKS COUNT
export const addDrink = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_authId", (q) => q.eq("authId", identity.subject))
      .unique();

    if (!user) throw new Error("User not found");

    const currentMonth = new Date().toISOString().slice(0, 7);

    let newCount = 1;

    if (user.drinksMonth === currentMonth) {
      newCount = (user.drinksCount ?? 0) + 1;
    }

    await ctx.db.patch(user._id, {
      drinksCount: newCount,
      drinksMonth: currentMonth,
    });
  },
});

//CREATE SUBSCRIPTION
export const createSubscription = mutation({
  args: { coffeeName: v.string() },
  handler: async (ctx, { coffeeName }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_authId", (q) => q.eq("authId", identity.subject))
      .unique();

    if (!user) throw new Error("User not found");

    // Only update subscription info — do NOT touch drinksCount
    await ctx.db.patch(user._id, {
      coffeeName,
      subscriptionId: Math.random().toString(36).slice(2),
      subDate: Date.now(),
      updatedAt: Date.now(),
    });
  },
});
