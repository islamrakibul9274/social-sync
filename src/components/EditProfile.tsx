"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Edit3, X } from "lucide-react";
import { updateUserProfile, uploadImageToImgBB } from "@/lib/actions";

export default function EditProfile({
  user,
}: {
  user: {
    name?: string | null;
    bio?: string | null;
    image?: string | null;
    headline?: string | null;
    github?: string | null;
    twitter?: string | null;
    website?: string | null;
  };
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [imgUrl, setImgUrl] = useState(user.image || "");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const secureUrl = await uploadImageToImgBB(formData);
      setImgUrl(secureUrl);
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setIsUploading(false);
    }
  };

  if (!isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className="py-1.5 px-3 rounded-md text-xs font-semibold bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors flex items-center gap-1.5 font-mono"
      >
        <Edit3 size={13} />
        <span>Edit Profile</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="linear-panel w-full max-w-md rounded-xl p-5 space-y-4 border border-zinc-800">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Edit Profile
          </h3>
          <button
            onClick={() => setIsEditing(false)}
            className="text-zinc-400 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        <form
          action={async (formData) => {
            setIsSaving(true);
            if (imgUrl) formData.append("image", imgUrl);
            await updateUserProfile(formData);
            setIsSaving(false);
            setIsEditing(false);
          }}
          className="space-y-3.5"
        >
          {/* Avatar Upload */}
          <div className="space-y-1">
            <label className="block text-[11px] font-mono text-zinc-400">
              Avatar
            </label>
            <div className="flex items-center gap-3">
              {imgUrl ? (
                <Image
                  src={imgUrl}
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
                onChange={handleImageUpload}
                className="text-xs text-zinc-400 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-zinc-300 hover:file:bg-zinc-700 cursor-pointer"
              />
              {isUploading && (
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
              Headline
            </label>
            <input
              type="text"
              name="headline"
              placeholder="e.g. Next.js Architect & AI Builder"
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

          {/* Socials */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1">
              <label className="block text-[11px] font-mono text-zinc-400">
                GitHub
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
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 rounded text-xs text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || isUploading}
              className="px-4 py-1.5 rounded text-xs font-semibold bg-white text-black hover:bg-zinc-200 disabled:opacity-50 transition-colors"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}