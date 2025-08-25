"use client";

import { useState, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useUpsertUser, useUserByEmail } from "@/hooks/useConvex";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import Link from "next/link";

export default function ReelsUploadPage() {
  const { user } = useUser();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const upsertUser = useUpsertUser();
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
      // Simulate video upload to cloud storage
      // In production, you'd use services like AWS S3, Cloudinary, etc.
      setUploadProgress(0);
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Get video duration
      const duration = await getVideoDuration(videoFile);
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Store video locally in public/videos folder
      const videoFileName = `${Date.now()}-${videoFile.name}`;
      const videoUrl = `/videos/${videoFileName}`;
      
      // In a real app, you'd upload to cloud storage here
      // For now, we'll store locally for testing
      
      // Create video record in database
      await createVideo({
        videoUrl,
        duration,
        caption: caption.trim() || undefined,
        creatorId: userProfile._id,
        creatorUsername: userProfile.username,
      });

      setMessage("Video uploaded successfully! 🎉");
      
      // Reset form
      setVideoFile(null);
      setCaption("");
      setVideoPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
    } catch (error) {
      setMessage("Error uploading video. Please try again.");
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const removeVideo = () => {
    setVideoFile(null);
    setVideoPreview(null);
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
              message.includes("Error") 
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
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
