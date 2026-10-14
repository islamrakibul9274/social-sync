"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Send, Image as ImageIcon, Hash, X } from "lucide-react";
import { createPost, uploadImageToImgBB } from "@/lib/actions";

interface PostFormProps {
  user: {
    id?: string | null;
    name?: string | null;
    image?: string | null;
  } | undefined | null;
  onPostCreated?: () => void;
}

const AVAILABLE_TAGS = ["general", "tech", "design", "ai", "dev", "crypto"];

export default function PostForm({ user, onPostCreated }: PostFormProps) {
  const [content, setContent] = useState("");
  const [selectedTag, setSelectedTag] = useState("general");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !imageFile) return;

    setIsSubmitting(true);
    try {
      let uploadedImageUrl: string | undefined = undefined;

      if (imageFile) {
        setIsUploading(true);
        const imgFormData = new FormData();
        imgFormData.append("image", imageFile);
        uploadedImageUrl = await uploadImageToImgBB(imgFormData);
        setIsUploading(false);
      }

      const formData = new FormData();
      formData.append("content", content.trim());
      formData.append("tag", selectedTag);
      if (uploadedImageUrl) formData.append("image", uploadedImageUrl);

      await createPost(formData);

      setContent("");
      setImageFile(null);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (onPostCreated) onPostCreated();
    } catch (err) {
      console.error("Failed to sync pulse:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const charCount = content.length;
  const maxChars = 500;

  return (
    <form
      onSubmit={handleSubmit}
      className="linear-card p-4 rounded-xl space-y-3.5"
    >
      <div className="flex items-start gap-3">
        {/* User Avatar */}
        <div className="w-8 h-8 rounded-md flex-shrink-0 relative overflow-hidden bg-zinc-800 border border-zinc-700">
          {user?.image ? (
            <Image src={user.image} alt="User" fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs font-mono font-bold text-zinc-300">
              {user?.name?.charAt(0) || "U"}
            </div>
          )}
        </div>

        {/* Text Input */}
        <div className="flex-1 min-w-0">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={maxChars}
            placeholder="Broadcast a pulse to the network..."
            className="w-full bg-transparent border-none focus:ring-0 text-white placeholder:text-zinc-500 resize-none py-1 text-xs sm:text-sm outline-none leading-relaxed"
            rows={2}
          />
        </div>
      </div>

      {/* Image Preview */}
      {imagePreview && (
        <div className="relative rounded-lg overflow-hidden max-h-56 border border-zinc-800 bg-zinc-950">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full h-auto max-h-56 object-contain rounded-lg"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-zinc-900/80 hover:bg-rose-600 text-white rounded-full p-1 transition-colors"
          >
            <X size={13} />
          </button>
        </div>
      )}

      {/* Bottom Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-800/80">
        <div className="flex items-center gap-2">
          {/* File Input */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors flex items-center gap-1.5 text-xs font-medium"
            title="Attach Image"
          >
            <ImageIcon size={14} />
            <span className="hidden sm:inline text-xs">Media</span>
          </button>

          {/* Tag Selector */}
          <div className="flex items-center gap-1 pl-2 border-l border-zinc-800">
            <Hash size={12} className="text-zinc-500" />
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-md px-2 py-0.5 text-xs text-zinc-300 font-mono outline-none"
            >
              {AVAILABLE_TAGS.map((tag) => (
                <option key={tag} value={tag} className="bg-zinc-950 text-white">
                  #{tag}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-zinc-500">
            {charCount}/{maxChars}
          </span>

          <button
            type="submit"
            disabled={(!content.trim() && !imageFile) || isSubmitting}
            className="py-1.5 px-4 bg-white hover:bg-zinc-200 disabled:opacity-40 text-black font-semibold rounded-md text-xs transition-colors flex items-center gap-1.5"
          >
            <Send size={12} />
            <span>{isSubmitting ? "Syncing..." : "Sync Pulse"}</span>
          </button>
        </div>
      </div>
    </form>
  );
}