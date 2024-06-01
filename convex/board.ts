//new API endpoint

import { v } from "convex/values";
import { mutation } from "./_generated/server";

const images = [
    "/placeholders/01.svg",
    "/placeholders/02.svg",
    "/placeholders/03.svg",
    "/placeholders/04.svg",
    "/placeholders/05.svg",
    "/placeholders/06.svg",
    "/placeholders/07.svg",
    "/placeholders/08.svg",
    "/placeholders/09.svg",
    "/placeholders/10.svg"
]

export const create = mutation({
    args: {
        title: v.string(),
        orgId: v.string()
    },
    handler: async (ctx, args) => { 
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized");
        }

        const randomImage = images[Math.floor(Math.random() * images.length)];
        const board = ctx.db.insert("boards", {
            title: args.title,
            orgId: args.orgId,
            authorId: identity.subject,
            authorName: identity.name!,
            imageUrl: randomImage,
        });
    }
});