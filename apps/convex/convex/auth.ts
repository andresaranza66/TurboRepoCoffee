import { createClient } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { betterAuth } from "better-auth";
import type { GenericCtx } from "@convex-dev/better-auth/utils";
import { components } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import schema from "./betterAuth/schema";
import authConfig from "./auth.config";
import { query } from "./_generated/server";

/**
 * REQUIRED EXPORT #1
 */
export const authComponent = createClient<DataModel, typeof schema>(
  components.betterAuth,
  {
    local: { schema },
    verbose: true,
  },
);

/**
 * REQUIRED EXPORT #2
 */
export const createAuthOptions = (ctx: GenericCtx<DataModel>) => ({
  appName: "My App",
  baseURL:
    process.env.BETTER_AUTH_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : ""),
  secret: process.env.BETTER_AUTH_SECRET ?? "",
  database: authComponent.adapter(ctx),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      overrideUserInfoOnSignIn: true,
    },
  },
  plugins: [convex({ authConfig, jwksRotateOnTokenGenerationError: true })],
});

/**
 * REQUIRED EXPORT #3
 */
export const createAuth = (ctx: GenericCtx<DataModel>) =>
  betterAuth(createAuthOptions(ctx));

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    return identity;
  },
});
