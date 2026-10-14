"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MessageSquare,
  Check,
  Plus,
  Globe,
  Code2,
  AtSign,
} from "lucide-react";
import { toggleFollow } from "@/lib/actions";
import EditProfile from "@/components/EditProfile";

interface ProfileHeaderProps {
  user: {
    id: string;
    name?: string | null;
    image?: string | null;
    coverImage?: string | null;
    headline?: string | null;
    bio?: string | null;
    website?: string | null;
    github?: string | null;
    twitter?: string | null;
    createdAt?: Date | string;
    followersCount: number;
    followingCount: number;
    isFollowing: boolean;
    postsCount: number;
  };
  isOwnProfile: boolean;
  currentUserId?: string | null;
}

export default function ProfileHeader({
  user,
  isOwnProfile,
  currentUserId,
}: ProfileHeaderProps) {
  const [isFollowing, setIsFollowing] = useState(user.isFollowing);
  const [followersCount, setFollowersCount] = useState(user.followersCount);

  const handleFollowToggle = async () => {
    if (!currentUserId) {
      window.location.href = "/auth/signin";
      return;
    }

    const nextState = !isFollowing;
    setIsFollowing(nextState);
    setFollowersCount((prev) => prev + (nextState ? 1 : -1));

    try {
      await toggleFollow(user.id);
    } catch (err) {
      setIsFollowing(!nextState);
      setFollowersCount((prev) => prev + (nextState ? -1 : 1));
    }
  };

  return (
    <div className="linear-card rounded-xl overflow-hidden relative">
      {/* Cover Banner */}
      <div className="h-28 sm:h-36 bg-zinc-900 border-b border-zinc-800 relative">
        <div className="absolute inset-0 tech-grid opacity-30 pointer-events-none" />
      </div>

      <div className="px-5 pb-5 pt-0 relative">
        {/* Avatar & Action Button Row */}
        <div className="flex items-end justify-between -mt-10 sm:-mt-12 mb-3">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border-4 border-[#050507] relative bg-zinc-800 shadow-md">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name || "Profile"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-zinc-800 flex items-center justify-center font-bold text-2xl text-zinc-300 font-mono">
                {user.name?.charAt(0) || "U"}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isOwnProfile ? (
              <EditProfile user={user as any} />
            ) : (
              <>
                {currentUserId && (
                  <Link
                    href={`/messages?userId=${user.id}`}
                    className="py-1.5 px-3 rounded-md text-xs font-semibold bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors flex items-center gap-1.5 font-mono"
                  >
                    <MessageSquare size={13} />
                    <span>Message</span>
                  </Link>
                )}

                <button
                  onClick={handleFollowToggle}
                  className={`py-1.5 px-3.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1 ${
                    isFollowing
                      ? "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-rose-400"
                      : "bg-white text-black hover:bg-zinc-200"
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <Check size={13} />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <Plus size={13} />
                      <span>Follow</span>
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>

        {/* User Info */}
        <div className="space-y-2.5">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {user.name}
            </h1>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              {user.headline || "Sync Member"}
            </p>
          </div>

          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-xl font-sans">
            {user.bio || "This creator prefers to keep an air of mystery..."}
          </p>

          {/* Social Links & Meta */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 pt-0.5 font-mono">
            {user.github && (
              <a
                href={`https://github.com/${user.github}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                <Code2 size={12} />
                <span>{user.github}</span>
              </a>
            )}
            {user.twitter && (
              <a
                href={`https://twitter.com/${user.twitter}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                <AtSign size={12} />
                <span>{user.twitter}</span>
              </a>
            )}
            {user.website && (
              <a
                href={user.website.startsWith("http") ? user.website : `https://${user.website}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                <Globe size={12} />
                <span>Website</span>
              </a>
            )}
          </div>

          {/* Follower / Following Stats */}
          <div className="flex items-center gap-5 pt-2 border-t border-zinc-800 text-xs font-mono">
            <div>
              <strong className="text-white font-bold">{user.postsCount}</strong>{" "}
              <span className="text-zinc-500">Pulses</span>
            </div>
            <div>
              <strong className="text-white font-bold">{followersCount}</strong>{" "}
              <span className="text-zinc-500">Followers</span>
            </div>
            <div>
              <strong className="text-white font-bold">{user.followingCount}</strong>{" "}
              <span className="text-zinc-500">Following</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
