"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Compass,
  LayoutDashboard,
  MessageSquare,
  Bookmark,
  User as UserIcon,
  LogOut,
  TrendingUp,
  Search,
  Users,
  Check,
  Plus,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { toggleFollow } from "@/lib/actions";

interface AppShellProps {
  children: React.ReactNode;
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    headline?: string | null;
  } | null;
  exploreUsers?: Array<{
    id: string;
    name?: string | null;
    image?: string | null;
    headline?: string | null;
    followersCount: number;
    isFollowing: boolean;
  }>;
  trendingTags?: string[];
  hideRightRail?: boolean;
}

export default function AppShell({
  children,
  user,
  exploreUsers = [],
  trendingTags = ["tech", "design", "ai", "crypto", "nextjs", "buildinpublic"],
  hideRightRail = false,
}: AppShellProps) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [followingStates, setFollowingStates] = useState<Record<string, boolean>>(
    exploreUsers.reduce((acc, u) => ({ ...acc, [u.id]: u.isFollowing }), {})
  );

  const handleFollowClick = async (targetUserId: string) => {
    setFollowingStates((prev) => ({
      ...prev,
      [targetUserId]: !prev[targetUserId],
    }));
    try {
      await toggleFollow(targetUserId);
    } catch (err) {
      setFollowingStates((prev) => ({
        ...prev,
        [targetUserId]: !prev[targetUserId],
      }));
    }
  };

  const navItems = [
    { label: "Feed", href: "/feed", icon: Compass },
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Messages", href: "/messages", icon: MessageSquare },
    { label: "Bookmarks", href: "/bookmarks", icon: Bookmark },
    {
      label: "Profile",
      href: user ? `/user/${user.id}` : "/auth/signin",
      icon: UserIcon,
    },
  ];

  return (
    <div className="min-h-screen bg-[#050507] text-[#f4f4f5] relative selection:bg-white/20">
      <div className="fixed inset-0 tech-grid pointer-events-none opacity-30 z-0" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10 flex">
        {/* ========================================================= */}
        {/* LEFT NAVIGATION RAIL (Desktop) */}
        {/* ========================================================= */}
        <aside className="hidden md:flex flex-col justify-between w-64 h-screen sticky top-0 py-6 pr-6 border-r border-zinc-800/80">
          <div className="space-y-6">
            {/* Brand Logo */}
            <Link href="/feed" className="flex items-center gap-3 px-2 group">
              <div className="w-7 h-7 rounded-md bg-white flex items-center justify-center text-black font-black text-xs group-hover:bg-zinc-200 transition-colors">
                S
              </div>
              <div>
                <span className="font-bold text-sm tracking-tight text-white block">
                  SocialSync
                </span>
                <span className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                  v2.6.0 • Stream
                </span>
              </div>
            </Link>

            {/* Nav Links */}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/feed" && pathname?.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? "bg-zinc-900 text-white border border-zinc-800 font-semibold"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-900/40"
                    }`}
                  >
                    <Icon
                      size={16}
                      className={isActive ? "text-white" : "text-zinc-400"}
                    />
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="ml-auto w-1 h-1 rounded-full bg-white" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User Profile Pill & Sign Out */}
          {user ? (
            <div className="p-2.5 rounded-lg linear-card flex items-center justify-between">
              <Link
                href={`/user/${user.id}`}
                className="flex items-center gap-2.5 min-w-0 hover:opacity-85 transition-opacity"
              >
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || "User"}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-md object-cover border border-zinc-800"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-md bg-zinc-800 text-zinc-300 flex items-center justify-center text-xs font-bold font-mono">
                    {user.name?.charAt(0) || "U"}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white truncate">
                    {user.name || "Member"}
                  </p>
                  <p className="text-[10px] text-zinc-500 font-mono truncate">
                    {user.headline || user.email || "Active"}
                  </p>
                </div>
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                title="Sign Out"
                className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-zinc-900 rounded-md transition-colors"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <Link
              href="/auth/signin"
              className="w-full py-2 px-3 rounded-md text-center text-xs font-semibold bg-white text-black hover:bg-zinc-200 transition-colors"
            >
              Sign In
            </Link>
          )}
        </aside>

        {/* ========================================================= */}
        {/* CENTER CONTENT COLUMN */}
        {/* ========================================================= */}
        <main
          className={`flex-1 min-h-screen pb-24 md:pb-12 ${
            hideRightRail ? "max-w-4xl mx-auto" : "max-w-2xl lg:max-w-2xl mx-auto"
          } py-6 md:px-6`}
        >
          {children}
        </main>

        {/* ========================================================= */}
        {/* RIGHT DISCOVERY RAIL (Desktop XL) */}
        {/* ========================================================= */}
        {!hideRightRail && (
          <aside className="hidden lg:flex flex-col w-72 h-screen sticky top-0 py-6 pl-6 space-y-5 border-l border-zinc-800/80">
            {/* Search Input */}
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
              />
              <input
                type="text"
                placeholder="Search stream..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    window.location.href = `/feed?search=${encodeURIComponent(
                      searchQuery.trim()
                    )}`;
                  }
                }}
                className="w-full linear-input text-xs text-white rounded-md py-2 pl-9 pr-9 placeholder:text-zinc-500 outline-none"
              />
              <span className="kbd-shortcut absolute right-2.5 top-1/2 -translate-y-1/2">
                ↵
              </span>
            </div>

            {/* Trending Tags */}
            <div className="p-3.5 rounded-lg linear-card space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                <TrendingUp size={13} className="text-zinc-400" />
                <span>Trending Tags</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {trendingTags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/feed?tag=${tag}`}
                    className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Who to Follow Suggestions */}
            {exploreUsers.length > 0 && (
              <div className="p-3.5 rounded-lg linear-card space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-white">
                  <div className="flex items-center gap-1.5">
                    <Users size={13} className="text-zinc-400" />
                    <span>Community</span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {exploreUsers.slice(0, 4).map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between gap-2.5"
                    >
                      <Link
                        href={`/user/${member.id}`}
                        className="flex items-center gap-2 min-w-0 hover:opacity-85"
                      >
                        {member.image ? (
                          <Image
                            src={member.image}
                            alt={member.name || "Member"}
                            width={28}
                            height={28}
                            className="w-7 h-7 rounded object-cover border border-zinc-800"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-300">
                            {member.name?.charAt(0) || "U"}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-white truncate">
                            {member.name}
                          </p>
                          <p className="text-[10px] text-zinc-500 font-mono truncate">
                            {member.headline || `${member.followersCount} followers`}
                          </p>
                        </div>
                      </Link>

                      {user && user.id !== member.id && (
                        <button
                          onClick={() => handleFollowClick(member.id)}
                          className={`text-[11px] font-medium px-2 py-0.5 rounded transition-colors ${
                            followingStates[member.id]
                              ? "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-rose-400"
                              : "bg-white text-black hover:bg-zinc-200"
                          }`}
                        >
                          {followingStates[member.id] ? "Following" : "Follow"}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* System Telemetry */}
            <div className="px-1 text-[10px] text-zinc-500 flex items-center justify-between font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Network Synced
              </span>
              <span>12ms</span>
            </div>
          </aside>
        )}
      </div>

      {/* ========================================================= */}
      {/* MOBILE BOTTOM DOCK */}
      {/* ========================================================= */}
      <nav className="md:hidden fixed bottom-3 left-1/2 -translate-x-1/2 w-[92%] max-w-sm linear-panel rounded-xl py-2 px-3 flex items-center justify-around z-50 shadow-2xl border border-zinc-800">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/feed" && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`p-2 rounded-lg transition-colors ${
                isActive ? "bg-zinc-900 text-white border border-zinc-800" : "text-zinc-400"
              }`}
            >
              <Icon size={18} />
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
