import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    // Better Auth core fields
    authId: v.string(),
    name: v.optional(v.string()),
    email: v.string(),
    emailVerified: v.optional(v.boolean()),
    image: v.optional(v.string()),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),

    // Subscription fields
    coffeeName: v.optional(v.string()),
    subscriptionId: v.optional(v.string()),
    drinksCount: v.optional(v.number()),
    drinksMonth: v.optional(v.string()),
    lastDrinkDate: v.optional(v.string()),
    subDate: v.optional(v.number()),
  })
    .index("by_email", ["email"])
    .index("by_authId", ["authId"]), // ⭐ ESTE FALTABA

  // Auth tables — DO NOT CHANGE
  sessions: defineTable({
    userId: v.string(),
    token: v.string(),
    expiresAt: v.number(),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_token", ["token"]),

  accounts: defineTable({
    userId: v.string(),
    accountId: v.string(),
    providerId: v.string(),
    accessToken: v.optional(v.string()),
    refreshToken: v.optional(v.string()),
    idToken: v.optional(v.string()),
    expiresAt: v.optional(v.number()),
    password: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  verifications: defineTable({
    identifier: v.string(),
    value: v.string(),
    expiresAt: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),
  coffees: defineTable({
    name: v.string(),
    price: v.number(),
    stock: v.number(),
    description: v.string(),
    image: v.optional(v.string()),
  }),
  orders: defineTable({
    userId: v.string(),
    coffeeId: v.id("coffees"),
    type: v.string(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_date", ["userId", "createdAt"]),
});
