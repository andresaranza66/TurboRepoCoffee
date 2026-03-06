import { mutation } from "./_generated/server";
import { components } from "./_generated/api";

export const resetBetterAuthJwks = mutation({
  args: {},
  handler: async (ctx) => {
    await ctx.runMutation(components.betterAuth.adapter.deleteMany, {
      input: {
        model: "jwks",
        where: [],
      },
      paginationOpts: {
        cursor: null,
        numItems: 1024,
      },
    });
    return { ok: true };
  },
});
