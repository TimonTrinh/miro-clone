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

export const remove = mutation({ 
    args: {
        id: v.id("boards")
    }, 
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized");
        }

        const board = await ctx.db.get(args.id);
        if (!board) {
            throw new Error("Board not found");
        }

        if (board.authorId!== identity.subject) {
            throw new Error("User is not board's owner");
        }

        //TODO: next to check and delete board in "Favorites" relation.

        await ctx.db.delete( args.id);
    }
})