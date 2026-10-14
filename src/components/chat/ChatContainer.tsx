"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MessageSquare,
  Search,
  Send,
  Image as ImageIcon,
  Plus,
  ArrowLeft,
  X,
  Check,
  CheckCheck,
  ExternalLink,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  sendMessage,
  getOrCreateConversation,
  markMessagesAsRead,
  uploadImageToImgBB,
} from "@/lib/actions";

interface ChatPartner {
  id: string;
  name?: string | null;
  image?: string | null;
  headline?: string | null;
}

interface MessageItem {
  id: string;
  content: string;
  image?: string | null;
  createdAt: Date | string;
  read: boolean;
  senderId: string;
  sender?: {
    id: string;
    name?: string | null;
    image?: string | null;
  };
}

interface ConversationItem {
  id: string;
  updatedAt: Date | string;
  lastMessageAt: Date | string;
  partner?: ChatPartner | null;
  lastMessage?: MessageItem | null;
  unreadCount: number;
}

interface ChatContainerProps {
  currentUserId: string;
  conversations: ConversationItem[];
  allUsers: Array<{
    id: string;
    name?: string | null;
    image?: string | null;
    headline?: string | null;
  }>;
  initialConversationId?: string | null;
  targetUserId?: string | null;
}

export default function ChatContainer({
  currentUserId,
  conversations: initialConversations,
  allUsers,
  initialConversationId,
  targetUserId,
}: ChatContainerProps) {
  const [conversations, setConversations] =
    useState<ConversationItem[]>(initialConversations);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(initialConversationId || (initialConversations[0]?.id ?? null));

  const [activePartner, setActivePartner] = useState<ChatPartner | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [chatImageFile, setChatImageFile] = useState<File | null>(null);
  const [chatImagePreview, setChatImagePreview] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // If targetUserId was passed in query, trigger conversation creation
  useEffect(() => {
    if (targetUserId && targetUserId !== currentUserId) {
      const startTargetChat = async () => {
        try {
          const convId = await getOrCreateConversation(targetUserId);
          setSelectedConversationId(convId);
        } catch (err) {
          console.error("Failed to start chat with target user:", err);
        }
      };
      startTargetChat();
    }
  }, [targetUserId, currentUserId]);

  // Scroll to bottom when messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load and poll messages for selected conversation
  useEffect(() => {
    if (!selectedConversationId) return;

    let isMounted = true;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/chat/${selectedConversationId}`);
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted) {
          setMessages(data.messages || []);
          if (data.partner) {
            setActivePartner(data.partner);
          }
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    setIsLoadingMessages(true);
    fetchMessages().finally(() => {
      if (isMounted) setIsLoadingMessages(false);
    });

    markMessagesAsRead(selectedConversationId);

    const interval = setInterval(fetchMessages, 3000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [selectedConversationId]);

  const handleSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setChatImageFile(file);
      setChatImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setChatImageFile(null);
    setChatImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedConversationId || (!inputText.trim() && !chatImageFile)) return;

    const contentToSend = inputText.trim();
    const tempId = `temp-${Date.now()}`;
    const imagePreviewToSend = chatImagePreview;

    const optimisticMsg: MessageItem = {
      id: tempId,
      content: contentToSend,
      image: imagePreviewToSend,
      createdAt: new Date(),
      read: false,
      senderId: currentUserId,
      sender: { id: currentUserId, name: "You" },
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setInputText("");
    setChatImageFile(null);
    setChatImagePreview(null);
    setIsSending(true);

    try {
      let uploadedImageUrl: string | undefined = undefined;

      if (chatImageFile) {
        const formData = new FormData();
        formData.append("image", chatImageFile);
        uploadedImageUrl = await uploadImageToImgBB(formData);
      }

      await sendMessage(
        selectedConversationId,
        contentToSend,
        uploadedImageUrl
      );
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setIsSending(false);
    }
  };

  const handleStartChatWithUser = async (targetId: string) => {
    try {
      const convId = await getOrCreateConversation(targetId);
      setSelectedConversationId(convId);
      setIsNewChatModalOpen(false);
      setUserSearchTerm("");
    } catch (err) {
      console.error("Failed to create conversation:", err);
    }
  };

  const filteredConversations = conversations.filter((c) =>
    c.partner?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = allUsers.filter(
    (u) =>
      u.id !== currentUserId &&
      (u.name?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
        u.headline?.toLowerCase().includes(userSearchTerm.toLowerCase()))
  );

  return (
    <div className="h-[calc(100vh-6.5rem)] linear-card rounded-xl overflow-hidden flex flex-col md:flex-row relative">
      {/* ============================================================= */}
      {/* LEFT: CONVERSATIONS LIST */}
      {/* ============================================================= */}
      <div
        className={`w-full md:w-80 flex-shrink-0 border-r border-zinc-800 flex flex-col h-full ${
          selectedConversationId ? "hidden md:flex" : "flex"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-3.5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare size={16} className="text-zinc-400" />
            <span className="font-semibold text-xs text-white uppercase tracking-wider font-mono">
              Direct Messages
            </span>
          </div>
          <button
            onClick={() => setIsNewChatModalOpen(true)}
            className="p-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
            title="Start New Chat"
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Search */}
        <div className="p-2.5 border-b border-zinc-800">
          <div className="relative">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
            />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full linear-input text-xs text-white rounded-md py-1.5 pl-8 pr-3 placeholder:text-zinc-500 outline-none"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto divide-y divide-zinc-800/60">
          {filteredConversations.map((conv) => {
            const isSelected = selectedConversationId === conv.id;
            return (
              <button
                key={conv.id}
                onClick={() => setSelectedConversationId(conv.id)}
                className={`w-full p-3 text-left flex items-start gap-2.5 transition-colors ${
                  isSelected
                    ? "bg-zinc-900 border-l-2 border-white"
                    : "hover:bg-zinc-900/40"
                }`}
              >
                <div className="relative flex-shrink-0">
                  {conv.partner?.image ? (
                    <Image
                      src={conv.partner.image}
                      alt={conv.partner.name || "User"}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-md object-cover border border-zinc-800"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-md bg-zinc-800 flex items-center justify-center font-bold text-xs text-zinc-300 font-mono">
                      {conv.partner?.name?.charAt(0) || "U"}
                    </div>
                  )}
                  {conv.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-white text-black text-[9px] font-bold flex items-center justify-center">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-xs font-semibold text-white truncate">
                      {conv.partner?.name || "Dialogue"}
                    </p>
                    {conv.lastMessageAt && (
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {formatDistanceToNow(new Date(conv.lastMessageAt), {
                          addSuffix: false,
                        })}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-400 truncate">
                    {conv.lastMessage?.content ||
                      (conv.lastMessage?.image ? "📷 Photo" : "No messages")}
                  </p>
                </div>
              </button>
            );
          })}

          {filteredConversations.length === 0 && (
            <div className="p-6 text-center space-y-2">
              <p className="text-xs text-zinc-500">No active dialogues.</p>
              <button
                onClick={() => setIsNewChatModalOpen(true)}
                className="text-xs font-semibold text-white hover:underline font-mono"
              >
                + Start Dialogue
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ============================================================= */}
      {/* RIGHT: ACTIVE CHAT THREAD */}
      {/* ============================================================= */}
      <div
        className={`flex-1 flex flex-col h-full bg-[#050507] ${
          !selectedConversationId ? "hidden md:flex" : "flex"
        }`}
      >
        {selectedConversationId ? (
          <>
            {/* Active Chat Header */}
            <div className="p-3 px-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setSelectedConversationId(null)}
                  className="md:hidden p-1 text-zinc-400 hover:text-white"
                >
                  <ArrowLeft size={16} />
                </button>

                {activePartner?.image ? (
                  <Image
                    src={activePartner.image}
                    alt={activePartner.name || "User"}
                    width={28}
                    height={28}
                    className="w-7 h-7 rounded-md object-cover border border-zinc-800"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-md bg-zinc-800 flex items-center justify-center font-bold text-xs text-zinc-300 font-mono">
                    {activePartner?.name?.charAt(0) || "U"}
                  </div>
                )}

                <div>
                  <h3 className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <span>{activePartner?.name || "Active Dialogue"}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  </h3>
                  <p className="text-[10px] text-zinc-500 font-mono truncate max-w-xs">
                    {activePartner?.headline || "Direct dialogue online"}
                  </p>
                </div>
              </div>

              {activePartner?.id && (
                <Link
                  href={`/user/${activePartner.id}`}
                  className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 transition-colors"
                >
                  <span>Profile</span>
                  <ExternalLink size={11} />
                </Link>
              )}
            </div>

            {/* Messages Thread */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => {
                const isMe = msg.senderId === currentUserId;
                return (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 ${
                      isMe ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!isMe && (
                      <div className="w-6 h-6 rounded bg-zinc-800 flex-shrink-0 flex items-center justify-center text-[9px] font-bold text-zinc-300 font-mono">
                        {msg.sender?.name?.charAt(0) || "U"}
                      </div>
                    )}

                    <div
                      className={`max-w-md sm:max-w-lg rounded-lg p-3 space-y-1 ${
                        isMe
                          ? "bg-white text-black font-normal"
                          : "bg-zinc-900 border border-zinc-800 text-zinc-200"
                      }`}
                    >
                      {msg.image && (
                        <div className="rounded overflow-hidden my-1 max-w-xs">
                          <img
                            src={msg.image}
                            alt="Attachment"
                            className="w-full h-auto object-cover rounded"
                          />
                        </div>
                      )}

                      {msg.content && (
                        <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                          {msg.content}
                        </p>
                      )}

                      <div
                        className={`flex items-center gap-1 text-[9px] font-mono ${
                          isMe ? "text-zinc-600 justify-end" : "text-zinc-500"
                        }`}
                      >
                        <span>
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {isMe &&
                          (msg.read ? (
                            <CheckCheck size={11} className="text-zinc-800" />
                          ) : (
                            <Check size={11} />
                          ))}
                      </div>
                    </div>
                  </div>
                );
              })}

              {messages.length === 0 && !isLoadingMessages && (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-2">
                  <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
                    <MessageSquare size={18} />
                  </div>
                  <p className="text-xs font-semibold text-white">
                    Start Dialogue
                  </p>
                  <p className="text-[11px] text-zinc-500 max-w-xs">
                    Send a message or attach a screenshot to sync in real time.
                  </p>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Image Preview if selected */}
            {chatImagePreview && (
              <div className="px-3 py-1.5 bg-zinc-950 border-t border-zinc-800 flex items-center gap-3">
                <div className="relative w-12 h-12 rounded overflow-hidden border border-zinc-700">
                  <img
                    src={chatImagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-0.5 right-0.5 bg-zinc-900 text-white rounded-full p-0.5"
                  >
                    <X size={10} />
                  </button>
                </div>
                <span className="text-xs text-zinc-400 font-mono">Attached</span>
              </div>
            )}

            {/* Composer */}
            <form
              onSubmit={handleSendMessage}
              className="p-2.5 border-t border-zinc-800 bg-zinc-950 flex items-center gap-2"
            >
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleSelectImage}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors"
                title="Attach Media"
              >
                <ImageIcon size={16} />
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type a message... (Press Enter to send)"
                className="flex-1 linear-input rounded-md px-3 py-1.5 text-xs text-white placeholder:text-zinc-500 outline-none"
              />

              <button
                type="submit"
                disabled={(!inputText.trim() && !chatImageFile) || isSending}
                className="py-1.5 px-3.5 bg-white hover:bg-zinc-200 disabled:opacity-30 text-black font-semibold rounded-md text-xs transition-colors"
              >
                <Send size={13} />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-2">
            <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
              <MessageSquare size={18} />
            </div>
            <h3 className="text-sm font-semibold text-white">Direct Dialogues</h3>
            <p className="text-xs text-zinc-500 max-w-sm">
              Select a conversation from the list or start a dialogue with any member.
            </p>
            <button
              onClick={() => setIsNewChatModalOpen(true)}
              className="py-1.5 px-3.5 rounded-md text-xs font-semibold bg-white text-black hover:bg-zinc-200 transition-colors"
            >
              New Message
            </button>
          </div>
        )}
      </div>

      {/* ============================================================= */}
      {/* NEW CHAT MODAL */}
      {/* ============================================================= */}
      {isNewChatModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="linear-panel w-full max-w-md rounded-xl p-5 space-y-3.5 border border-zinc-800">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Start Direct Dialogue
              </h3>
              <button
                onClick={() => setIsNewChatModalOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div className="relative">
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
              />
              <input
                type="text"
                placeholder="Search member..."
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
                className="w-full linear-input text-xs text-white rounded-md py-1.5 pl-8 pr-3 placeholder:text-zinc-500 outline-none"
              />
            </div>

            <div className="max-h-60 overflow-y-auto space-y-1 divide-y divide-zinc-800/60">
              {filteredUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleStartChatWithUser(user.id)}
                  className="w-full p-2 rounded-md hover:bg-zinc-900 flex items-center gap-2.5 text-left transition-colors"
                >
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || "User"}
                      width={28}
                      height={28}
                      className="w-7 h-7 rounded object-cover"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-300 font-mono">
                      {user.name?.charAt(0) || "U"}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white truncate">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-zinc-500 font-mono truncate">
                      {user.headline || "Member"}
                    </p>
                  </div>
                </button>
              ))}

              {filteredUsers.length === 0 && (
                <p className="text-xs text-zinc-500 text-center py-4 font-mono">
                  No matching members.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
