"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Zap,
  TrendingUp,
  MessageSquare,
  Users,
  Heart,
  Flame,
  Trash2,
  Bookmark,
  ExternalLink,
  Send,
  Image as ImageIcon,
  Edit3,
  X,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  createPost,
  deletePost,
  toggleBookmark,
  updateUserProfile,
  uploadImageToImgBB,
} from "@/lib/actions";

interface DashboardViewProps {
  metrics: {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      coverImage?: string | null;
      headline?: string | null;
      bio?: string | null;
      website?: string | null;
      github?: string | null;
      twitter?: string | null;
    };
    stats: {
      totalPulses: number;
      totalReactionsReceived: number;
      totalCommentsReceived: number;
      followersCount: number;
      followingCount: number;
      reactionBreakdown: {
        HEART: number;
        ZAP: number;
        FIRE: number;
        THUMBS_UP: number;
        SAD: number;
      };
    };
    cadence: Array<{ day: string; count: number }>;
    recentActivities: Array<{
      id: string;
      type: string;
      authorName: string;
      authorImage?: string | null;
      content: string;
      postContent: string;
      postId: string;
      createdAt: Date | string;
    }>;
    posts: any[];
    bookmarks: any[];
  };
}

export default function DashboardView({ metrics }: DashboardViewProps) {
  const { user, stats, cadence, recentActivities, posts, bookmarks } = metrics;
  const [activeTab, setActiveTab] = useState<"posts" | "bookmarks" | "activity">(
    "posts"
  );

  // Quick Composer State
  const [composerContent, setComposerContent] = useState("");
  const [composerTag, setComposerTag] = useState("general");
  const [composerImageFile, setComposerImageFile] = useState<File | null>(null);
  const [composerImagePreview, setComposerImagePreview] = useState<string | null>(
    null
  );
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);

  // Edit Profile Modal
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileImgUrl, setProfileImgUrl] = useState(user.image || "");
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Post Deletion
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);

  const handleDeletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this pulse?")) return;
    setDeletingPostId(postId);
    try {
      await deletePost(postId);
    } catch (err) {
      console.error("Failed to delete pulse:", err);
      alert("Failed to delete pulse.");
    } finally {
      setDeletingPostId(null);
    }
  };

  const handleQuickPostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!composerContent.trim() && !composerImageFile) return;

    setIsSubmittingPost(true);
    try {
      let uploadedUrl: string | undefined = undefined;
      if (composerImageFile) {
        const formData = new FormData();
        formData.append("image", composerImageFile);
        uploadedUrl = await uploadImageToImgBB(formData);
      }

      const postData = new FormData();
      postData.append("content", composerContent);
      postData.append("tag", composerTag);
      if (uploadedUrl) postData.append("image", uploadedUrl);

      await createPost(postData);
      setComposerContent("");
      setComposerImageFile(null);
      setComposerImagePreview(null);
    } catch (err) {
      console.error("Failed to submit pulse:", err);
    } finally {
      setIsSubmittingPost(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const url = await uploadImageToImgBB(formData);
      setProfileImgUrl(url);
    } catch (err) {
      console.error("Avatar upload failed:", err);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const maxCadence = Math.max(...cadence.map((c) => c.count), 1);

  return (
    <div className="space-y-6">
      {/* ============================================================= */}
      {/* 1. DASHBOARD HEADER & PROFILE STRIP */}
      {/* ============================================================= */}
      <div className="linear-card p-5 sm:p-6 rounded-xl relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name || "User"}
                width={56}
                height={56}
                className="w-14 h-14 rounded-lg object-cover border border-zinc-800"
              />
            ) : (
              <div className="w-14 h-14 rounded-lg bg-zinc-800 flex items-center justify-center font-bold text-xl text-zinc-300 font-mono">
                {user.name?.charAt(0) || "U"}
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  {user.name}
                </h1>
                <span className="font-mono text-[10px] text-zinc-400 border border-zinc-800 px-1.5 py-0.5 rounded">
                  Creator
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5 max-w-md font-sans">
                {user.headline || user.bio || "Active network creator node."}
              </p>
              <div className="flex items-center gap-3 mt-1.5 text-xs text-zinc-400 font-mono">
                <span>
                  <strong className="text-white">{stats.followersCount}</strong> Followers
                </span>
                <span>
                  <strong className="text-white">{stats.followingCount}</strong> Following
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={() => setIsEditProfileOpen(true)}
              className="py-1.5 px-3 rounded-md text-xs font-medium bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors flex items-center gap-1.5"
            >
              <Edit3 size={13} />
              <span>Edit Profile</span>
            </button>
            <Link
              href={`/user/${user.id}`}
              className="py-1.5 px-3 rounded-md text-xs font-semibold bg-white text-black hover:bg-zinc-200 transition-colors flex items-center gap-1"
            >
              <span>Public</span>
              <ExternalLink size={12} />
            </Link>
          </div>
        </div>
      </div>

      {/* ============================================================= */}
      {/* 2. STATS GRID */}
      {/* ============================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="linear-card p-4 rounded-xl space-y-1">
          <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">
            Total Pulses
          </span>
          <p className="text-2xl font-bold text-white font-mono">
            {stats.totalPulses}
          </p>
          <p className="text-[10px] text-zinc-500 font-mono">Broadcast</p>
        </div>

        <div className="linear-card p-4 rounded-xl space-y-1">
          <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">
            Reactions Received
          </span>
          <p className="text-2xl font-bold text-white font-mono">
            {stats.totalReactionsReceived}
          </p>
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-mono">
            <span>❤️{stats.reactionBreakdown.HEART}</span>
            <span>⚡{stats.reactionBreakdown.ZAP}</span>
            <span>🔥{stats.reactionBreakdown.FIRE}</span>
          </div>
        </div>

        <div className="linear-card p-4 rounded-xl space-y-1">
          <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">
            Comments
          </span>
          <p className="text-2xl font-bold text-white font-mono">
            {stats.totalCommentsReceived}
          </p>
          <p className="text-[10px] text-zinc-500 font-mono">Replies generated</p>
        </div>

        <div className="linear-card p-4 rounded-xl space-y-1">
          <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">
            Subscribers
          </span>
          <p className="text-2xl font-bold text-white font-mono">
            {stats.followersCount}
          </p>
          <p className="text-[10px] text-zinc-500 font-mono">Connected</p>
        </div>
      </div>

      {/* ============================================================= */}
      {/* 3. 7-DAY CADENCE & IN-DASHBOARD STUDIO */}
      {/* ============================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Visual 7-day Cadence Chart */}
        <div className="linear-card p-5 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp size={15} className="text-zinc-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                7-Day Velocity
              </h3>
            </div>
            <span className="text-[10px] font-mono text-zinc-500">Volume</span>
          </div>

          <div className="pt-2 flex items-end justify-between h-32 gap-2 px-1">
            {cadence.map((item, idx) => {
              const heightPct = Math.max(Math.round((item.count / maxCadence) * 100), 10);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <span className="text-[9px] font-mono text-zinc-400">
                    {item.count > 0 ? item.count : ""}
                  </span>
                  <div
                    style={{ height: `${heightPct}%` }}
                    className={`w-full max-w-[28px] rounded transition-all duration-300 ${
                      item.count > 0 ? "bg-white" : "bg-zinc-800"
                    }`}
                  />
                  <span className="text-[10px] font-mono text-zinc-500">
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Creator Studio / Quick Compose */}
        <div className="linear-card p-5 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap size={15} className="text-zinc-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Quick Dispatch
              </h3>
            </div>
          </div>

          <form onSubmit={handleQuickPostSubmit} className="space-y-2.5">
            <textarea
              rows={2}
              value={composerContent}
              onChange={(e) => setComposerContent(e.target.value)}
              placeholder="Draft and broadcast a pulse..."
              className="w-full linear-input rounded-md p-2.5 text-xs text-white placeholder:text-zinc-500 outline-none resize-none font-sans"
            />

            {composerImagePreview && (
              <div className="relative w-14 h-14 rounded overflow-hidden border border-zinc-700">
                <img
                  src={composerImagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setComposerImageFile(null);
                    setComposerImagePreview(null);
                  }}
                  className="absolute top-0.5 right-0.5 bg-zinc-900 rounded-full p-0.5 text-white"
                >
                  <X size={10} />
                </button>
              </div>
            )}

            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-2">
                <label className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded cursor-pointer transition-colors">
                  <ImageIcon size={14} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setComposerImageFile(file);
                        setComposerImagePreview(URL.createObjectURL(file));
                      }
                    }}
                    className="hidden"
                  />
                </label>

                <select
                  value={composerTag}
                  onChange={(e) => setComposerTag(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 rounded px-2 py-0.5 text-[11px] text-zinc-300 font-mono outline-none"
                >
                  <option value="general">#general</option>
                  <option value="tech">#tech</option>
                  <option value="design">#design</option>
                  <option value="ai">#ai</option>
                  <option value="dev">#dev</option>
                  <option value="crypto">#crypto</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={(!composerContent.trim() && !composerImageFile) || isSubmittingPost}
                className="py-1 px-3.5 rounded text-xs font-semibold bg-white text-black hover:bg-zinc-200 disabled:opacity-40 transition-colors flex items-center gap-1"
              >
                <Send size={11} />
                <span>{isSubmittingPost ? "Syncing..." : "Broadcast"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ============================================================= */}
      {/* 4. CONTENT MANAGER TABS */}
      {/* ============================================================= */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 border-b border-zinc-800 pb-2.5">
          <button
            onClick={() => setActiveTab("posts")}
            className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
              activeTab === "posts"
                ? "bg-zinc-800 text-white font-semibold"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            My Pulses ({posts.length})
          </button>
          <button
            onClick={() => setActiveTab("bookmarks")}
            className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
              activeTab === "bookmarks"
                ? "bg-zinc-800 text-white font-semibold"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Saved Bookmarks ({bookmarks.length})
          </button>
          <button
            onClick={() => setActiveTab("activity")}
            className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
              activeTab === "activity"
                ? "bg-zinc-800 text-white font-semibold"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Audience Activity ({recentActivities.length})
          </button>
        </div>

        {/* Tab 1: My Pulses */}
        {activeTab === "posts" && (
          <div className="space-y-2.5">
            {posts.map((post) => (
              <div
                key={post.id}
                className="linear-card p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
                    <span>
                      {formatDistanceToNow(new Date(post.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                    {post.tag && (
                      <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                        #{post.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-200 line-clamp-2">
                    {post.content}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-zinc-400 pt-0.5 font-mono text-[11px]">
                    <span>❤️ {post.reactions?.length || 0}</span>
                    <span>💬 {post.comments?.length || 0}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-center">
                  <Link
                    href={`/feed?search=${encodeURIComponent(post.content.slice(0, 20))}`}
                    className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors"
                    title="View in Feed"
                  >
                    <ExternalLink size={14} />
                  </Link>
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    disabled={deletingPostId === post.id}
                    className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 rounded-md transition-colors disabled:opacity-40"
                    title="Delete Pulse"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}

            {posts.length === 0 && (
              <div className="linear-panel p-10 text-center rounded-xl space-y-1.5">
                <p className="text-xs font-semibold text-white">No Pulses Broadcast Yet</p>
                <p className="text-[11px] text-zinc-500">
                  Compose your first pulse from the studio above.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Saved Bookmarks */}
        {activeTab === "bookmarks" && (
          <div className="space-y-2.5">
            {bookmarks.map((post) => (
              <div
                key={post.id}
                className="linear-card p-4 rounded-xl flex items-start justify-between gap-3"
              >
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">
                      {post.author?.name || "Author"}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {formatDistanceToNow(new Date(post.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-200 line-clamp-2">
                    {post.content}
                  </p>
                </div>

                <button
                  onClick={async () => {
                    await toggleBookmark(post.id);
                  }}
                  className="p-1.5 text-white hover:text-rose-400 hover:bg-zinc-800 rounded-md transition-colors"
                  title="Remove Bookmark"
                >
                  <Bookmark size={14} className="fill-white" />
                </button>
              </div>
            ))}

            {bookmarks.length === 0 && (
              <div className="linear-panel p-10 text-center rounded-xl space-y-1.5">
                <p className="text-xs font-semibold text-white">No Bookmarks Saved</p>
                <p className="text-[11px] text-zinc-500">
                  Bookmark pulses in the feed to reference them here.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Audience Activity */}
        {activeTab === "activity" && (
          <div className="space-y-2.5">
            {recentActivities.map((act) => (
              <div
                key={act.id}
                className="linear-card p-3 rounded-xl flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center text-zinc-300 flex-shrink-0">
                    <MessageSquare size={12} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-white">
                      <strong className="text-zinc-200">{act.authorName}</strong>{" "}
                      commented: &ldquo;{act.content}&rdquo;
                    </p>
                    <p className="text-[10px] text-zinc-500 font-mono truncate">
                      on pulse: &ldquo;{act.postContent}&rdquo;
                    </p>
                  </div>
                </div>

                <span className="text-[9px] text-zinc-500 font-mono flex-shrink-0">
                  {formatDistanceToNow(new Date(act.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            ))}

            {recentActivities.length === 0 && (
              <div className="linear-panel p-10 text-center rounded-xl space-y-1.5">
                <p className="text-xs font-semibold text-white">No Recent Activity</p>
                <p className="text-[11px] text-zinc-500">
                  Interactions on your pulses will appear here.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ============================================================= */}
      {/* 5. EDIT PROFILE MODAL */}
      {/* ============================================================= */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="linear-panel w-full max-w-md rounded-xl p-5 space-y-4 border border-zinc-800">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Edit Creator Profile
              </h3>
              <button
                onClick={() => setIsEditProfileOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <form
              action={async (formData) => {
                setIsUpdatingProfile(true);
                if (profileImgUrl) formData.append("image", profileImgUrl);
                await updateUserProfile(formData);
                setIsUpdatingProfile(false);
                setIsEditProfileOpen(false);
              }}
              className="space-y-3.5"
            >
              {/* Avatar Upload */}
              <div className="space-y-1">
                <label className="block text-[11px] font-mono text-zinc-400">
                  Profile Picture
                </label>
                <div className="flex items-center gap-3">
                  {profileImgUrl ? (
                    <Image
                      src={profileImgUrl}
                      alt="Preview"
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-md object-cover border border-zinc-700"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-md bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-300 font-mono">
                      {user.name?.charAt(0) || "U"}
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="text-xs text-zinc-400 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-zinc-300 hover:file:bg-zinc-700 cursor-pointer"
                  />
                  {isUploadingAvatar && (
                    <span className="text-[10px] text-zinc-400 font-mono animate-pulse">
                      Uploading...
                    </span>
                  )}
                </div>
              </div>

              {/* Name */}
              <div className="space-y-1">
                <label className="block text-[11px] font-mono text-zinc-400">
                  Display Name
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={user.name || ""}
                  className="w-full linear-input rounded-md px-3 py-1.5 text-xs text-white outline-none"
                />
              </div>

              {/* Headline */}
              <div className="space-y-1">
                <label className="block text-[11px] font-mono text-zinc-400">
                  Headline / Role
                </label>
                <input
                  type="text"
                  name="headline"
                  placeholder="e.g. Senior Frontend Architect"
                  defaultValue={user.headline || ""}
                  className="w-full linear-input rounded-md px-3 py-1.5 text-xs text-white outline-none"
                />
              </div>

              {/* Bio */}
              <div className="space-y-1">
                <label className="block text-[11px] font-mono text-zinc-400">
                  Bio
                </label>
                <textarea
                  name="bio"
                  rows={2}
                  defaultValue={user.bio || ""}
                  className="w-full linear-input rounded-md px-3 py-1.5 text-xs text-white outline-none resize-none"
                />
              </div>

              {/* Links */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="block text-[11px] font-mono text-zinc-400">
                    GitHub Username
                  </label>
                  <input
                    type="text"
                    name="github"
                    placeholder="username"
                    defaultValue={user.github || ""}
                    className="w-full linear-input rounded-md px-2.5 py-1.5 text-xs text-white outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-mono text-zinc-400">
                    Twitter / X
                  </label>
                  <input
                    type="text"
                    name="twitter"
                    placeholder="handle"
                    defaultValue={user.twitter || ""}
                    className="w-full linear-input rounded-md px-2.5 py-1.5 text-xs text-white outline-none"
                  />
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="px-3 py-1.5 rounded text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingProfile || isUploadingAvatar}
                  className="px-4 py-1.5 rounded text-xs font-semibold bg-white text-black hover:bg-zinc-200 disabled:opacity-50 transition-colors"
                >
                  {isUpdatingProfile ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
