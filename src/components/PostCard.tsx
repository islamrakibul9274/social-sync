"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  MessageSquare,
  Bookmark,
  Trash2,
  MessageCircle,
} from "lucide-react";
import ReactionButtons from "./ReactionButtons";
import CommentSection from "./CommentSection";
import { toggleBookmark, deletePost } from "@/lib/actions";

interface PostCardProps {
  post: {
    id: string;
    content: string;
    image?: string | null;
    tag?: string | null;
    createdAt: Date | string;
    authorId: string;
    author: {
      id?: string;
      name?: string | null;
      image?: string | null;
      headline?: string | null;
    };
    reactions: any[];
    comments: any[];
    bookmarks?: any[];
  };
  currentUserId?: string | null;
}

export default function PostCard({ post, currentUserId }: PostCardProps) {
  const isAuthor = currentUserId === post.authorId;
  const [isBookmarked, setIsBookmarked] = useState(
    post.bookmarks?.some((b) => b.userId === currentUserId) || false
  );
  const [showComments, setShowComments] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const handleBookmarkClick = async () => {
    if (!currentUserId) {
      window.location.href = "/auth/signin";
      return;
    }
    setIsBookmarked((prev) => !prev);
    try {
      await toggleBookmark(post.id);
    } catch (err) {
      setIsBookmarked((prev) => !prev);
    }
  };

  const handleDeletePost = async () => {
    if (!confirm("Are you sure you want to delete this pulse?")) return;
    setIsDeleted(true);
    try {
      await deletePost(post.id);
    } catch (err) {
      setIsDeleted(false);
      alert("Failed to delete pulse.");
    }
  };

  if (isDeleted) return null;

  return (
    <article className="linear-card p-4 sm:p-5 rounded-xl space-y-3 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <Link
            href={`/user/${post.authorId}`}
            className="w-8 h-8 rounded-md flex-shrink-0 relative overflow-hidden bg-zinc-800 border border-zinc-700"
          >
            {post.author?.image ? (
              <Image
                src={post.author.image}
                alt={post.author.name || "User"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-xs text-zinc-300 font-mono">
                {post.author?.name?.charAt(0) || "U"}
              </div>
            )}
          </Link>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Link
                href={`/user/${post.authorId}`}
                className="font-semibold text-xs sm:text-sm text-white hover:underline truncate"
              >
                {post.author?.name}
              </Link>
              {post.tag && (
                <Link
                  href={`/feed?tag=${post.tag}`}
                  className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-800"
                >
                  #{post.tag}
                </Link>
              )}
            </div>
            <p className="text-[10px] text-zinc-500 font-mono">
              {formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 text-zinc-400">
          {!isAuthor && currentUserId && (
            <Link
              href={`/messages?userId=${post.authorId}`}
              className="p-1.5 text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors flex items-center gap-1 font-mono"
              title="Message Creator"
            >
              <MessageCircle size={14} />
              <span className="hidden sm:inline text-[11px]">Chat</span>
            </Link>
          )}

          <button
            onClick={handleBookmarkClick}
            className={`p-1.5 rounded-md transition-colors ${
              isBookmarked
                ? "text-white bg-zinc-800"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800"
            }`}
            title={isBookmarked ? "Remove Bookmark" : "Save Pulse"}
          >
            <Bookmark
              size={14}
              className={isBookmarked ? "fill-white" : ""}
            />
          </button>

          {isAuthor && (
            <button
              onClick={handleDeletePost}
              className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 rounded-md transition-colors"
              title="Delete Pulse"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Post Text */}
      <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap font-sans">
        {post.content}
      </p>

      {/* Post Image Attachment */}
      {post.image && (
        <div className="rounded-lg overflow-hidden border border-zinc-800 max-h-96 relative bg-zinc-950">
          <img
            src={post.image}
            alt="Pulse attachment"
            className="w-full h-auto max-h-96 object-cover rounded-lg"
          />
        </div>
      )}

      {/* Reactions & Comment Bar */}
      <div className="pt-1.5">
        <div className="flex items-center justify-between">
          <ReactionButtons
            postId={post.id}
            reactions={post.reactions || []}
            currentUserId={currentUserId}
          />

          <button
            onClick={() => setShowComments((prev) => !prev)}
            className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white px-2 py-1 rounded transition-colors"
          >
            <MessageSquare size={13} />
            <span className="font-mono text-[11px]">
              {post.comments?.length || 0}
            </span>
          </button>
        </div>

        {/* Comment Section Drawer */}
        {showComments && (
          <CommentSection
            postId={post.id}
            comments={post.comments || []}
            currentUserId={currentUserId}
          />
        )}
      </div>
    </article>
  );
}
