"use client";

import { toggleReaction } from "@/lib/actions";
import { useOptimistic } from "react";

const EMOJIS = {
  HEART: "❤️",
  ZAP: "⚡",
  FIRE: "🔥",
  THUMBS_UP: "👍",
  SAD: "😢",
};

export default function ReactionButtons({ 
  postId, 
  reactions 
}: { 
  postId: string, 
  reactions: any[] 
}) {
  return (
    <div className="flex gap-2 mt-4">
      {(Object.keys(EMOJIS) as Array<keyof typeof EMOJIS>).map((type) => {
        const count = reactions.filter(r => r.type === type).length;
        
        return (
          <button
            key={type}
            onClick={() => toggleReaction(postId, type)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/20 transition-all text-sm"
          >
            <span>{EMOJIS[type]}</span>
            <span className="text-gray-400 font-medium">{count}</span>
          </button>
        );
      })}
    </div>
  );
}