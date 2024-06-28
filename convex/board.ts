//new API endpoint

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

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

        //Next to check and delete board in "Favorites" relation.
        const userId = identity.subject;
        const existingFav = await ctx.db.query("userFavorites")
            .withIndex("by_user_board", (q) => 
                q.eq("userId", userId)
                 .eq("boardId", args.id)
            ).unique();
        if (existingFav) {
            await ctx.db.delete(existingFav._id);
        }

        //Now safe to delete the board
        await ctx.db.delete( args.id);
    }
})

export const rename = mutation({ 
    args: {
        id: v.id("boards"),
        title: v.string()
    }, 
    handler: async (ctx, args) => {
        const title = args.title.trim();
        if (!title) {
            throw new Error("Title is required");
        }
        if (title.length > 60) {
            throw new Error("Title cannot be longer than 60 characters.");
        }

        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized");
        }

        const board = await ctx.db.get(args.id);
        if (!board) {
            throw new Error("Board not found");
        }

        if (board.authorId !== identity.subject) {
            throw new Error("User is not board's owner");
        }

        await ctx.db.patch(args.id, {
            title: args.title
        });
    }
})

export const favorite = mutation({
    args: { 
        id: v.id("boards"),
        orgId: v.string()
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
        
        if (board.orgId!== args.orgId) {
            throw new Error("Board does not belong to the specified organization");
        }
        const userId = identity.subject;
        // const favorite = await ctx.db.get(["userFavorites", identity.subject, args.id, args.orgId]);
        const favorite = await ctx.db.query("userFavorites")
            .withIndex("by_user_board_org", (q) => 
                q.eq("userId", userId)
                 .eq("boardId", args.id)
                 .eq("orgId", args.orgId)
            ).unique();
        if (favorite) {
            throw new Error("Board is already in your favorites");
        }

        await ctx.db.insert("userFavorites", {
            userId,
            boardId: args.id,
            orgId: args.orgId
        });
        return board;
    }
})


export const unfavorite = mutation({
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

        const userId = identity.subject;
        const favorite = await ctx.db.query("userFavorites")
            .withIndex("by_user_board", (q) => 
                q.eq("userId", userId)
                 .eq("boardId", args.id)
            ).unique();
        if (!favorite) {
            throw new Error("Board is not found in your favorites");
        }

        await ctx.db.delete(favorite._id);
        return board;
    }
})

export const get = query({  
    args: {id: v.id("boards")},
    handler: async (ctx,args) => {
        const board = await ctx.db.get(args.id);

        return board;
    }
})