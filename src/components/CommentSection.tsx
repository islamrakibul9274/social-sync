"use client";

import React, { useState, useRef } from "react";
import { formatDistanceToNow } from "date-fns";
import { Send, Trash2 } from "lucide-react";
import { createComment, deleteComment } from "@/lib/actions";

export default function CommentSection({
  postId,
  comments: initialComments,
  currentUserId,
}: {
  postId: string;
  comments: any[];
  currentUserId?: string | null;
}) {
  const [comments, setComments] = useState(initialComments);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    if (!currentUserId) {
      window.location.href = "/auth/signin";
      return;
    }

    const optimisticComment = {
      id: `temp-${Date.now()}`,
      content: content.trim(),
      createdAt: new Date(),
      authorId: currentUserId,
      author: { name: "You" },
    };

    setComments((prev) => [...prev, optimisticComment]);
    setContent("");
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("content", optimisticComment.content);
      await createComment(postId, formData);
    } catch (err) {
      console.error("Failed to post reply:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
    try {
      await deleteComment(commentId);
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  const displayedComments = showAll ? comments : comments.slice(-3);

  return (
    <div className="mt-3 pt-3 border-t border-zinc-800 space-y-2.5">
      {/* Existing Comments */}
      {comments.length > 3 && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="text-[11px] text-zinc-400 hover:text-white font-mono"
        >
          View all {comments.length} replies...
        </button>
      )}

      <div className="space-y-2">
        {displayedComments.map((comment) => {
          const isOwnComment = comment.authorId === currentUserId;
          return (
            <div key={comment.id} className="flex items-start gap-2 text-xs group">
              <div className="w-5 h-5 rounded bg-zinc-800 flex-shrink-0 flex items-center justify-center font-bold text-[9px] text-zinc-300 font-mono">
                {comment.author?.name?.charAt(0) || "U"}
              </div>

              <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-md p-2 space-y-0.5">
                <div className="flex items-baseline justify-between">
                  <span className="font-semibold text-white text-[11px]">
                    {comment.author?.name || "Member"}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] text-zinc-500 font-mono">
                      {formatDistanceToNow(new Date(comment.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                    {isOwnComment && (
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-rose-400 transition-opacity"
                        title="Delete Reply"
                      >
                        <Trash2 size={11} />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-zinc-300 text-xs leading-relaxed font-sans">
                  {comment.content}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Reply Form */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-1">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a dialogue reply..."
          className="flex-1 linear-input rounded-md px-3 py-1.5 text-xs text-white placeholder:text-zinc-500 outline-none"
        />
        <button
          type="submit"
          disabled={!content.trim() || isSubmitting}
          className="py-1.5 px-3 bg-white hover:bg-zinc-200 text-black font-semibold disabled:opacity-30 rounded-md text-xs transition-colors flex items-center gap-1"
          title="Send Reply"
        >
          <span>Reply</span>
        </button>
      </form>
    </div>
  );
}