//new API endpoint

import { v } from "convex/values";
import { mutation } from "./_generated/server";

const images = [
    "public/placeholders/01.svg",
    "public/placeholders/02.svg",
    "public/placeholders/03.svg",
    "public/placeholders/04.svg",
    "public/placeholders/05.svg",
    "public/placeholders/06.svg",
    "public/placeholders/07.svg",
    "public/placeholders/08.svg",
    "public/placeholders/09.svg",
    "public/placeholders/10.svg"
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