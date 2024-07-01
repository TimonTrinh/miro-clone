import {createClient} from "@liveblocks/client";
import {createRoomContext} from "@liveblocks/react";

const client = createClient({
  // publicApiKey: "pk_prod_pO0UAgPrisV3uN2BPfAcnRIH4CpwUR82mMc_FQdVUsUqjpo_wFrKrVQ_tj9b_77_",
  authEndpoint: "/api/liveblocks-auth", 
  throttle: 16,
})

// Define Liveblocks types for your application
// https://liveblocks.io/docs/api-reference/liveblocks-react#Typing-your-data
declare global {
  interface Liveblocks {
    // Each user's Presence, for useMyPresence, useOthers, etc.
    Presence: {
      cursor: { x: number; y: number } |  null;
    };

    // The Storage tree for the room, for useMutation, useStorage, etc.
    Storage: {
      // Example, a conflict-free list
      // animals: LiveList<string>;
    };

    UserMeta: {
      id?: string;
      info?: {
        name: string;
        picture: string;
      };
    };

    // Custom events, for useBroadcastEvent, useEventListener
    RoomEvent: {};
      // Example has two events, using a union
      // | { type: "PLAY" } 
      // | { type: "REACTION"; emoji: "🔥" };

    // Custom metadata set on threads, for useThreads, useCreateThread, etc.
    ThreadMetadata: {
      // Example, attaching coordinates to a thread
      // x: number;
      // y: number;
    };

    // Custom room info set with resolveRoomsInfo, for useRoomInfo
    RoomInfo: {
      // Example, rooms with a title and url
      // title: string;
      // url: string;
    };
  }
}

export const {
  suspense: {
    RoomProvider, 
    useRoom, 
    useOthers,
    useOther,
    useSelf, 
    useHistory,
    useCanUndo, useCanRedo, 
    useOthersConnectionIds,
    useMutation,
  }
} = createRoomContext(client);