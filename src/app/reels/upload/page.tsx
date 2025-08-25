"use client";

import { useState, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useUserByEmail } from "@/hooks/useConvex";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import Link from "next/link";
import { upload, type PutBlobResult } from '@vercel/blob/client';

export default function ReelsUploadPage() {
  const { user } = useUser();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [uploadedBlob, setUploadedBlob] = useState<PutBlobResult | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createVideo = useMutation(api.videos.createVideo);
  
  // Get user profile data
  const userProfile = useUserByEmail(user?.emailAddresses?.[0]?.emailAddress || null);

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('video/')) {
        setMessage("Please select a valid video file!");
        return;
      }
      
      // Validate file size (max 200MB)
      if (file.size > 200 * 1024 * 1024) {
        setMessage("Video file size must be less than 200MB!");
        return;
      }

      setVideoFile(file);
      setMessage("");
      setUploadedBlob(null); // Reset previous upload
      
      // Create preview
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
    }
  };

  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(Math.round(video.duration));
      };
      video.src = URL.createObjectURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!videoFile || !user) {
      setMessage("Please select a video file and ensure you're signed in!");
      return;
    }

    if (!userProfile) {
      setMessage("Please create your profile with your email first before uploading videos!");
      return;
    }

    setIsUploading(true);
    setMessage("");

    try {
      // Get video duration first
      const duration = await getVideoDuration(videoFile);
      
      // Use client-side upload to Vercel Blob
      setMessage("Uploading video to Vercel Blob...");
      setUploadProgress(10);
      
      // Create organized filename with date structure
      const now = new Date();
      const dateFolder = now.toISOString().split('T')[0]; // YYYY-MM-DD format
      const timestamp = now.getTime();
      const sanitizedName = videoFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filename = `videos/${dateFolder}/${timestamp}-${sanitizedName}`;
      
      setUploadProgress(20);
      
      // Upload directly to Vercel Blob using client upload
      const blob = await upload(filename, videoFile, {
        access: 'public',
        handleUploadUrl: '/api/upload-video-client',
        // Add metadata for the upload
        clientPayload: {
          userId: user.id,
          userEmail: user.emailAddresses?.[0]?.emailAddress,
          videoDuration: duration,
          caption: caption.trim() || undefined,
        },
      });
      
      setUploadProgress(80);
      setUploadedBlob(blob);
      
      setMessage("Video uploaded successfully! Creating database record...");
      
      // Create video record in database
      await createVideo({
        videoUrl: blob.url,
        duration,
        caption: caption.trim() || undefined,
        creatorId: userProfile._id,
        creatorUsername: userProfile.username,
      });

      setUploadProgress(100);
      setMessage("Video uploaded successfully! 🎉");
      
      // Reset form
      setVideoFile(null);
      setCaption("");
      setVideoPreview(null);
      setUploadedBlob(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
    } catch (error) {
      console.error("Upload error:", error);
      
      // Handle specific error types
      if (error instanceof Error) {
        if (error.message.includes('too large') || error.message.includes('413')) {
          setMessage("File too large. Maximum size is 200MB.");
        } else if (error.message.includes('network') || error.message.includes('timeout')) {
          setMessage("Upload timeout. Please try again with a smaller file.");
        } else if (error.message.includes('BLOB_ACCESS_DENIED')) {
          setMessage("Access denied. Please check your Vercel Blob configuration.");
        } else if (error.message.includes('BLOB_STORE_NOT_FOUND')) {
          setMessage("Blob store not found. Please configure Vercel Blob for your project.");
        } else {
          setMessage(`Upload failed: ${error.message}`);
        }
      } else {
        setMessage("Error uploading video. Please try again.");
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const removeVideo = () => {
    setVideoFile(null);
    setVideoPreview(null);
    setUploadedBlob(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Reel</h1>
            <p className="text-gray-600">Share your video with the world!</p>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-md ${
              message.includes("Error") || message.includes("failed") || message.includes("denied") || message.includes("not found")
                ? "bg-red-50 text-red-700 border border-red-200" 
                : "bg-green-50 text-green-700 border border-green-200"
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Video Upload Section */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {!videoPreview ? (
                <div>
                  <div className="mx-auto h-12 w-12 text-gray-400">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M6 20h12M6 4h12" />
                    </svg>
                  </div>
                  <div className="mt-4">
                    <label htmlFor="video-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        Drop your video here, or{" "}
                        <span className="text-blue-600 hover:text-blue-500">browse</span>
                      </span>
                      <span className="mt-1 block text-xs text-gray-500">
                        MP4, MOV, AVI up to 200MB
                      </span>
                    </label>
                    <input
                      id="video-upload"
                      ref={fileInputRef}
                      name="video-upload"
                      type="file"
                      accept="video/*"
                      className="sr-only"
                      onChange={handleVideoSelect}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <video
                    src={videoPreview}
                    controls
                    className="mx-auto max-h-64 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeVideo}
                    className="mt-4 text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Remove Video
                  </button>
                </div>
              )}
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
                <p className="text-sm text-gray-600 mt-2 text-center">
                  Uploading... {uploadProgress}%
                </p>
              </div>
            )}

            {/* Caption Input */}
            <div>
              <label htmlFor="caption" className="block text-sm font-medium text-gray-700 mb-2">
                Caption (Optional)
              </label>
              <textarea
                id="caption"
                name="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={3}
                maxLength={2200}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Write a caption for your video..."
              />
              <p className="text-xs text-gray-500 mt-1 text-right">
                {caption.length}/2200
              </p>
            </div>

            {/* Upload Button */}
            <div className="flex justify-between items-center">
              <Link
                href="/reels"
                className="px-6 py-3 rounded-md font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </Link>
              
              <button
                type="submit"
                disabled={!videoFile || isUploading}
                className={`px-6 py-3 rounded-md font-medium text-white ${
                  !videoFile || isUploading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                }`}
              >
                {isUploading ? "Uploading..." : "Upload Reel"}
              </button>
            </div>
          </form>

          {/* Upload Tips */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-medium text-blue-900 mb-2">💡 Upload Tips</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Use vertical videos (9:16 aspect ratio) for best results</li>
              <li>• Keep videos under 60 seconds for maximum engagement</li>
              <li>• Add engaging captions to increase reach</li>
              <li>• Ensure good lighting and clear audio</li>
              <li>• Large files (>100MB) will use optimized multipart uploads</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
