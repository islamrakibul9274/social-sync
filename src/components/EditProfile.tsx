"use client";

import { useState } from "react";
import Image from "next/image";
import { updateUserProfile, uploadImageToImgBB } from "@/lib/actions";

export default function EditProfile({
  user
}: {
  user: { name?: string | null; bio?: string | null; image?: string | null }
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imgUrl, setImgUrl] = useState(user.image || "");

  // 1. The ImgBB Uploader Function (Now 100% Secure)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file); // Append the raw file

    try {
      // 🔒 SECURE: We now call the Server Action instead of exposing the API key!
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
        className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-medium transition-all backdrop-blur-md border border-white/10"
      >
        Edit Profile
      </button>
    );
  }

  // 2. The Form UI
  return (
    <div className="mt-6 p-6 bg-black/40 border border-white/10 rounded-2xl backdrop-blur-xl">
      <form action={async (formData) => {
        // Append our ImgBB URL to the form data before sending to our Server Action
        formData.append("image", imgUrl);
        await updateUserProfile(formData);
        setIsEditing(false); // Close the form when done
      }} className="space-y-4">

        {/* Avatar Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Profile Picture</label>
          <div className="flex items-center gap-4">
            {imgUrl && (
              <Image 
                src={imgUrl} 
                alt="Preview" 
                width={48} 
                height={48} 
                className="w-12 h-12 rounded-full object-cover border border-white/20" 
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600/20 file:text-blue-400 hover:file:bg-blue-600/30 transition-all cursor-pointer"
            />
          </div>
          {isUploading && <p className="text-xs text-blue-400 mt-1 animate-pulse">Uploading to ImgBB...</p>}
        </div>

        {/* Name Input */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Display Name</label>
          <input
            type="text"
            name="name"
            defaultValue={user.name || ""}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:ring-1 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Bio Input */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Bio</label>
          <textarea
            name="bio"
            defaultValue={user.bio || ""}
            rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:ring-1 focus:ring-blue-500 outline-none resize-none"
          />
        </div>

        {/* Controls */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isUploading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20"
          >
            {isUploading ? "Please wait..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}