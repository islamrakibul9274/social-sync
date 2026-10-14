"use client";

import React, { useState } from "react";
import { toggleReaction } from "@/lib/actions";

const EMOJIS = {
  HEART: { icon: "❤️", label: "Heart" },
  ZAP: { icon: "⚡", label: "Zap" },
  FIRE: { icon: "🔥", label: "Fire" },
  THUMBS_UP: { icon: "👍", label: "Thumbs Up" },
  SAD: { icon: "😢", label: "Sad" },
};

export default function ReactionButtons({
  postId,
  reactions: initialReactions,
  currentUserId,
}: {
  postId: string;
  reactions: any[];
  currentUserId?: string | null;
}) {
  const [reactions, setReactions] = useState(initialReactions);

  const handleToggle = async (type: keyof typeof EMOJIS) => {
    if (!currentUserId) {
      window.location.href = "/auth/signin";
      return;
    }

    const hasReacted = reactions.some(
      (r) => r.type === type && r.authorId === currentUserId
    );

    // Optimistic update
    if (hasReacted) {
      setReactions((prev) =>
        prev.filter(
          (r) => !(r.type === type && r.authorId === currentUserId)
        )
      );
    } else {
      setReactions((prev) => [
        ...prev,
        { id: `temp-${Date.now()}`, type, authorId: currentUserId, postId },
      ]);
    }

    try {
      await toggleReaction(postId, type);
    } catch (err) {
      setReactions(initialReactions);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5 pt-1">
      {(Object.keys(EMOJIS) as Array<keyof typeof EMOJIS>).map((type) => {
        const count = reactions.filter((r) => r.type === type).length;
        const isActive = currentUserId
          ? reactions.some(
              (r) => r.type === type && r.authorId === currentUserId
            )
          : false;

        return (
          <button
            key={type}
            type="button"
            onClick={() => handleToggle(type)}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono transition-colors ${
              isActive
                ? "bg-zinc-800 text-white border border-zinc-600 font-semibold"
                : "bg-zinc-900/60 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800"
            }`}
          >
            <span className="text-xs">{EMOJIS[type].icon}</span>
            {count > 0 && (
              <span className="text-[11px]">{count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}