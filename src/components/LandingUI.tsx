"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MessageSquare,
  Terminal,
  Activity,
  Shield,
  Layers,
  Search,
  ExternalLink,
  ChevronRight,
  Heart,
  Flame,
  Zap,
  Check,
  Copy,
  ArrowUpRight,
  Code2,
} from "lucide-react";

type UserProps = {
  id?: string | null;
  name?: string | null;
  email?: string | null;
  image?: string | null;
} | null;

export default function LandingUI({ user }: { user: UserProps }) {
  return (
    <div className="min-h-screen bg-[#050507] text-[#f4f4f5] selection:bg-white/20 selection:text-white">
      {/* 1px Engineered Grid Background */}
      <div className="fixed inset-0 tech-grid pointer-events-none opacity-40 z-0" />

      {/* Full-Width Precision Navbar */}
      <EngineeredNavbar user={user} />

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 space-y-28">
        <HeroSection user={user} />
        <InteractiveSystemTerminal user={user} />
        <BentoGridTechnical />
        <ComparisonMatrix />
        <ActionBanner user={user} />
      </main>

      <EngineeredFooter />
    </div>
  );
}

// =============================================================================
// 1. Engineered Full-Width Navbar
// =============================================================================
function EngineeredNavbar({ user }: { user: UserProps }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-[#050507]/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Left: Brand & Version */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5">
            {/* Minimalist Monochrome Logo Mark */}
            <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center text-black font-black text-xs">
              S
            </div>
            <span className="font-semibold text-sm tracking-tight text-white">
              SocialSync
            </span>
          </Link>

          <div className="hidden sm:flex items-center gap-2">
            <span className="font-mono text-[10px] text-zinc-400 border border-zinc-800 bg-zinc-900/60 px-1.5 py-0.5 rounded">
              v2.6.0
            </span>
            <span className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400 pl-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Operational
            </span>
          </div>
        </div>

        {/* Center: Segmented Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-xs text-zinc-400">
          <a
            href="#features"
            className="hover:text-white transition-colors"
          >
            Capabilities
          </a>
          <a
            href="#terminal"
            className="hover:text-white transition-colors"
          >
            Live Simulator
          </a>
          <a
            href="#matrix"
            className="hover:text-white transition-colors"
          >
            Specification
          </a>
          <Link
            href="/feed"
            className="hover:text-white transition-colors"
          >
            Stream
          </Link>
        </nav>

        {/* Right: Search & Actions */}
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/islamrakibul9274/social-sync"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono text-zinc-400 border border-zinc-800 hover:border-zinc-700 hover:text-white transition-colors"
          >
            <Code2 size={13} />
            <span>GitHub</span>
          </a>

          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="hidden sm:inline-block text-xs text-zinc-400 hover:text-white"
              >
                Dashboard
              </Link>
              <Link
                href="/feed"
                className="flex items-center gap-2 py-1.5 px-3.5 rounded-md text-xs font-medium bg-white text-black hover:bg-zinc-200 transition-colors"
              >
                {user.image && (
                  <Image
                    src={user.image}
                    alt={user.name || "User"}
                    width={18}
                    height={18}
                    className="w-4 h-4 rounded-full object-cover"
                  />
                )}
                <span>Launch App &rarr;</span>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/signin"
                className="text-xs text-zinc-400 hover:text-white px-3 py-1.5 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="py-1.5 px-3.5 rounded-md text-xs font-medium bg-white text-black hover:bg-zinc-200 transition-colors"
              >
                Initialize Account
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

// =============================================================================
// 2. Hero Section (Zero Gradients, High-Precision Typography)
// =============================================================================
function HeroSection({ user }: { user: UserProps }) {
  const [copied, setCopied] = useState(false);

  const handleCopyCmd = () => {
    navigator.clipboard.writeText("git clone https://github.com/islamrakibul9274/social-sync.git");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="text-center pt-8 sm:pt-14 space-y-6 max-w-4xl mx-auto">
      {/* Release Notice Pill */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono border border-zinc-800 bg-zinc-900/70 text-zinc-300">
        <span className="text-white font-semibold">ENGINEERING LOG</span>
        <span className="text-zinc-600">•</span>
        <span>Real-Time Pulse Protocol 2.6 Active</span>
        <ChevronRight size={13} className="text-zinc-500" />
      </div>

      {/* Main Display Headline (Clean Solid White) */}
      <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.08]">
        The real-time social layer for modern engineers.
      </h1>

      {/* Concise Technical Subtitle */}
      <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
        High-density pulse streams, direct peer dialogues, and creator telemetry.
        Built with Next.js 16 Turbopack, NextAuth JWT security, and MongoDB clustering.
      </p>

      {/* Call to Actions & Terminal Copy */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
        <Link
          href={user ? "/feed" : "/auth/signup"}
          className="w-full sm:w-auto py-2.5 px-6 rounded-md text-xs font-semibold bg-white text-black hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
        >
          <span>{user ? "Open Pulse Feed" : "Get Started Free"}</span>
          <ArrowUpRight size={14} />
        </Link>

        {/* Quick Clone / Command Bar */}
        <button
          onClick={handleCopyCmd}
          className="w-full sm:w-auto py-2 px-3.5 rounded-md text-xs font-mono text-zinc-300 border border-zinc-800 bg-zinc-950 hover:border-zinc-700 transition-colors flex items-center justify-center gap-2"
        >
          <span className="text-zinc-500">$</span>
          <span>git clone social-sync</span>
          {copied ? (
            <Check size={13} className="text-emerald-400 ml-1" />
          ) : (
            <Copy size={13} className="text-zinc-500 ml-1" />
          )}
        </button>
      </div>

      {/* Benchmark Badges */}
      <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
        <div className="linear-card p-3.5 rounded-lg">
          <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">
            Pipeline
          </span>
          <p className="text-lg font-bold text-white mt-0.5">Turbopack</p>
          <p className="text-[11px] text-zinc-400">Sub-500ms startup</p>
        </div>
        <div className="linear-card p-3.5 rounded-lg">
          <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">
            Dialogue Engine
          </span>
          <p className="text-lg font-bold text-white mt-0.5">Direct 1-on-1</p>
          <p className="text-[11px] text-zinc-400">Encrypted threads</p>
        </div>
        <div className="linear-card p-3.5 rounded-lg">
          <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">
            Data Layer
          </span>
          <p className="text-lg font-bold text-white mt-0.5">Prisma 6.19</p>
          <p className="text-[11px] text-zinc-400">Clustered MongoDB</p>
        </div>
        <div className="linear-card p-3.5 rounded-lg">
          <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">
            Authentication
          </span>
          <p className="text-lg font-bold text-white mt-0.5">NextAuth v5</p>
          <p className="text-[11px] text-zinc-400">JWT Strategy</p>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// 3. Interactive Technical Terminal & Pulse Simulator
// =============================================================================
function InteractiveSystemTerminal({ user }: { user: UserProps }) {
  const [activeTab, setActiveTab] = useState<"stream" | "chat" | "telemetry">(
    "stream"
  );
  const [reactions, setReactions] = useState({ HEART: 12, ZAP: 19, FIRE: 28 });
  const [activeReactions, setActiveReactions] = useState<Record<string, boolean>>({
    ZAP: true,
  });
  const [mockMessages, setMockMessages] = useState([
    { sender: "Elena (Core Dev)", text: "Deployed the updated schema indexes. Pings are under 12ms.", time: "16:42" },
    { sender: "You", text: "Verified! The feed rendering feels instantaneous.", time: "16:43" },
  ]);
  const [chatInput, setChatInput] = useState("");

  const handleToggleReaction = (type: "HEART" | "ZAP" | "FIRE") => {
    setActiveReactions((prev) => {
      const active = !!prev[type];
      setReactions((r) => ({ ...r, [type]: r[type] + (active ? -1 : 1) }));
      return { ...prev, [type]: !active };
    });
  };

  const handleSendMockMsg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setMockMessages((prev) => [
      ...prev,
      {
        sender: "You",
        text: chatInput.trim(),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setChatInput("");
  };

  return (
    <section id="terminal" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-zinc-800 pb-3">
        <div>
          <span className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">
            Interactive Testbed
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Live Component Sandbox
          </h2>
        </div>
        {/* Segmented Switcher */}
        <div className="flex items-center gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-lg">
          {(["stream", "chat", "telemetry"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                activeTab === tab
                  ? "bg-zinc-800 text-white font-semibold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {tab === "stream" ? "Pulse Stream" : tab === "chat" ? "Direct Chat" : "Telemetry"}
            </button>
          ))}
        </div>
      </div>

      {/* Terminal Window Box */}
      <div className="linear-panel rounded-xl overflow-hidden shadow-2xl border border-zinc-800">
        {/* Top Window Bar */}
        <div className="h-9 px-4 border-b border-zinc-800/80 bg-zinc-950 flex items-center justify-between text-xs font-mono text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
            <span className="text-zinc-400 ml-2">socialsync-engine // sandbox.io</span>
          </div>
          <div className="flex items-center gap-2 text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>SOCKET: OK</span>
          </div>
        </div>

        {/* Tab 1: Pulse Stream Interactive */}
        {activeTab === "stream" && (
          <div className="p-6 space-y-4 bg-[#09090b]">
            <div className="linear-card p-4 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-zinc-800 text-zinc-300 font-mono text-xs flex items-center justify-center font-bold">
                    R
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-white">Rakib Islam</span>
                    <span className="text-[10px] text-zinc-500 font-mono ml-2">@rakib • 3m ago</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                  #system
                </span>
              </div>

              <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-sans">
                Engineered the pulse feed layout using tactile 1px borders and high-density typography.
                Zero cheesy gradients. Zero unnecessary bloat. Just pure speed.
              </p>

              {/* Reaction triggers */}
              <div className="flex items-center gap-2 pt-2 border-t border-zinc-800/80">
                <button
                  onClick={() => handleToggleReaction("HEART")}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                    activeReactions.HEART
                      ? "bg-zinc-800 text-white border border-zinc-700"
                      : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
                  }`}
                >
                  <Heart size={12} className={activeReactions.HEART ? "fill-white" : ""} />
                  <span>{reactions.HEART}</span>
                </button>

                <button
                  onClick={() => handleToggleReaction("ZAP")}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                    activeReactions.ZAP
                      ? "bg-zinc-800 text-white border border-zinc-700"
                      : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
                  }`}
                >
                  <Zap size={12} className={activeReactions.ZAP ? "fill-white" : ""} />
                  <span>{reactions.ZAP}</span>
                </button>

                <button
                  onClick={() => handleToggleReaction("FIRE")}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                    activeReactions.FIRE
                      ? "bg-zinc-800 text-white border border-zinc-700"
                      : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
                  }`}
                >
                  <Flame size={12} className={activeReactions.FIRE ? "fill-white" : ""} />
                  <span>{reactions.FIRE}</span>
                </button>

                <span className="text-[10px] font-mono text-zinc-500 ml-auto">
                  Click to test optimistic updates
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Direct Chat Interactive */}
        {activeTab === "chat" && (
          <div className="p-6 space-y-4 bg-[#09090b]">
            <div className="space-y-3 min-h-[140px]">
              {mockMessages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.sender === "You" ? "items-end" : "items-start"}`}>
                  <span className="text-[10px] font-mono text-zinc-500 mb-0.5">
                    {msg.sender} • {msg.time}
                  </span>
                  <div
                    className={`max-w-md rounded-lg p-2.5 text-xs ${
                      msg.sender === "You"
                        ? "bg-white text-black font-medium"
                        : "bg-zinc-900 border border-zinc-800 text-zinc-200"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMockMsg} className="flex gap-2 pt-2 border-t border-zinc-800">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type a simulated message..."
                className="flex-1 linear-input rounded-md px-3 py-1.5 text-xs text-white"
              />
              <button
                type="submit"
                className="py-1.5 px-4 rounded-md text-xs font-semibold bg-white text-black hover:bg-zinc-200"
              >
                Send
              </button>
            </form>
          </div>
        )}

        {/* Tab 3: Telemetry Stream */}
        {activeTab === "telemetry" && (
          <div className="p-6 bg-[#09090b] font-mono text-xs text-zinc-400 space-y-2">
            <p className="text-zinc-500">// Real-time cluster metrics dump</p>
            <p className="text-emerald-400">✓ Database Connection: cluster0.obdwazm.mongodb.net [ESTABLISHED]</p>
            <p className="text-zinc-300">&gt; NextAuth JWT Strategy: Active (sub: 69ca8326...)</p>
            <p className="text-zinc-300">&gt; Active Indices: Bookmark_userId_postId, Follow_followerId_followingId</p>
            <p className="text-zinc-300">&gt; Edge Response Time: 14.2ms</p>
            <p className="text-zinc-500">// Protocol state: idle</p>
          </div>
        )}
      </div>
    </section>
  );
}

// =============================================================================
// 4. Bento Grid (Engineered 1px Precision, High Density)
// =============================================================================
function BentoGridTechnical() {
  return (
    <section id="features" className="space-y-6">
      <div className="border-b border-zinc-800 pb-3">
        <span className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">
          Architecture
        </span>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Engineered for precision and clarity.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Pulse Stream (Span 2) */}
        <div className="md:col-span-2 linear-card p-6 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400">01 // STREAM ENGINE</span>
            <span className="text-[10px] font-mono text-zinc-500">REALTIME</span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            High-Density Pulse Broadcast
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-xl">
            Stream thoughts, markdown snippets, and full-resolution media attachments.
            Filter dynamically by hashtag indexing or author subscriptions with instant client caches.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
              #MediaCDN
            </span>
            <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
              #HashtagIndices
            </span>
            <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
              #OptimisticDispatch
            </span>
          </div>
        </div>

        {/* Card 2: Direct Dialogues (Span 1) */}
        <div className="linear-card p-6 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400">02 // DIALOGUE</span>
            <span className="text-[10px] font-mono text-emerald-400">P2P STYLE</span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Direct Peer Chat
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Dedicated `/messages` hub for 1-on-1 private threads. Unread status badges,
            image transfers, and instant member directory search.
          </p>
          <div className="pt-2">
            <span className="text-[11px] font-mono text-zinc-300">
              3s Active Polling Sync
            </span>
          </div>
        </div>

        {/* Card 3: Creator Telemetry (Span 1) */}
        <div className="linear-card p-6 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400">03 // TELEMETRY</span>
            <span className="text-[10px] font-mono text-zinc-500">ANALYTICS</span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Creator Intelligence Hub
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Command center visualizing 7-day velocity cadences, reaction distributions,
            and content lifecycle management.
          </p>
          <div className="pt-2">
            <span className="text-[11px] font-mono text-zinc-300">
              /dashboard Integration
            </span>
          </div>
        </div>

        {/* Card 4: Security & Clusters (Span 2) */}
        <div className="md:col-span-2 linear-card p-6 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400">04 // INFRASTRUCTURE</span>
            <span className="text-[10px] font-mono text-zinc-500">ENCRYPTED</span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Distributed MongoDB & Cryptographic JWTs
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-xl">
            Robust data persistence with Prisma Client 6.19 and NextAuth v5 session tokens.
            Edge-ready middleware proxying with zero extraneous overhead.
          </p>
          <div className="flex items-center gap-4 text-xs font-mono text-zinc-300 pt-1">
            <span>• Bcrypt Password Hashing</span>
            <span>• Indexed Queries</span>
            <span>• Zero Tracking</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// 5. Technical Comparison Matrix
// =============================================================================
function ComparisonMatrix() {
  const rows = [
    { feature: "UI Paradigm", legacy: "Flashy purple neon gradients", socialsync: "Engineered 1px precision monochrome" },
    { feature: "Direct Messaging", legacy: "None / static comments", socialsync: "Full /messages hub with image attachments" },
    { feature: "Creator Dashboard", legacy: "Barebones profile", socialsync: "7-day activity cadence & telemetry metrics" },
    { feature: "Content Controls", legacy: "Basic text only", socialsync: "Image attachments, hashtags, bookmarks, deletion" },
    { feature: "Framework", legacy: "Legacy Webpack", socialsync: "Next.js 16 Turbopack & React 19" },
  ];

  return (
    <section id="matrix" className="space-y-4">
      <div className="border-b border-zinc-800 pb-3">
        <span className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">
          System Comparison
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          How SocialSync v2.6 compares.
        </h2>
      </div>

      <div className="linear-panel rounded-xl overflow-hidden border border-zinc-800">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-950 font-mono text-[11px] text-zinc-400">
              <th className="p-3.5 pl-5">Capability</th>
              <th className="p-3.5 text-zinc-500">Legacy Architecture</th>
              <th className="p-3.5 pr-5 text-white">SocialSync 2026</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/80">
            {rows.map((row, i) => (
              <tr key={i} className="hover:bg-zinc-900/40 transition-colors">
                <td className="p-3.5 pl-5 font-medium text-white">{row.feature}</td>
                <td className="p-3.5 text-zinc-500">{row.legacy}</td>
                <td className="p-3.5 pr-5 font-mono text-zinc-200 flex items-center gap-1.5">
                  <Check size={13} className="text-emerald-400" />
                  <span>{row.socialsync}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// =============================================================================
// 6. Action Banner
// =============================================================================
function ActionBanner({ user }: { user: UserProps }) {
  return (
    <section className="linear-card p-8 sm:p-12 rounded-xl text-center space-y-4 border border-zinc-800">
      <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
        Ready to broadcast on the new network?
      </h2>
      <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
        Create an account in seconds or enter the feed stream to experience the real-time social layer.
      </p>
      <div className="pt-2">
        <Link
          href={user ? "/feed" : "/auth/signup"}
          className="inline-flex items-center gap-2 py-2.5 px-6 rounded-md text-xs font-semibold bg-white text-black hover:bg-zinc-200 transition-colors"
        >
          <span>{user ? "Open Feed Stream" : "Initialize Account"}</span>
          <ArrowUpRight size={14} />
        </Link>
      </div>
    </section>
  );
}

// =============================================================================
// 7. Engineered Footer
// =============================================================================
function EngineeredFooter() {
  return (
    <footer className="border-t border-zinc-800/80 py-10 text-xs text-zinc-500 bg-[#050507]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded bg-zinc-800 text-zinc-300 text-[10px] font-bold flex items-center justify-center">
            S
          </div>
          <span className="text-zinc-400 font-medium">SocialSync Protocol</span>
          <span className="font-mono text-[10px]">&copy; {new Date().getFullYear()}</span>
        </div>

        <div className="flex items-center gap-6 font-mono text-[11px]">
          <Link href="/feed" className="hover:text-zinc-300 transition-colors">
            Stream
          </Link>
          <Link href="/dashboard" className="hover:text-zinc-300 transition-colors">
            Dashboard
          </Link>
          <Link href="/messages" className="hover:text-zinc-300 transition-colors">
            Messages
          </Link>
          <a
            href="https://github.com/islamrakibul9274/social-sync"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-300 transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}