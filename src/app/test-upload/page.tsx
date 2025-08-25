'use client';

import { type PutBlobResult } from '@vercel/blob';
import { upload } from '@vercel/blob/client';
import { useState, useRef } from 'react';

export default function TestUploadPage() {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Video Upload</h1>
          <p className="text-gray-600 mb-6">Test the client-side upload functionality</p>

          {message && (
            <div className={`mb-6 p-4 rounded-md ${
              message.includes("Error") || message.includes("failed")
                ? "bg-red-50 text-red-700 border border-red-200" 
                : "bg-green-50 text-green-700 border border-green-200"
            }`}>
              {message}
            </div>
          )}

          <form
            onSubmit={async (event) => {
              event.preventDefault();
              setIsUploading(true);
              setMessage('');

              try {
                if (!inputFileRef.current?.files) {
                  throw new Error('No file selected');
                }

                const file = inputFileRef.current.files[0];
                
                // Validate file type
                if (!file.type.startsWith('video/')) {
                  throw new Error('Please select a valid video file');
                }

                // Validate file size (max 200MB)
                if (file.size > 200 * 1024 * 1024) {
                  throw new Error('File size must be less than 200MB');
                }

                setMessage('Uploading...');

                // Create organized filename
                const now = new Date();
                const dateFolder = now.toISOString().split('T')[0];
                const timestamp = now.getTime();
                const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
                const filename = `test-uploads/${dateFolder}/${timestamp}-${sanitizedName}`;

                const newBlob = await upload(filename, file, {
                  access: 'public',
                  handleUploadUrl: '/api/upload-video-client',
                  clientPayload: {
                    testUpload: true,
                    timestamp: new Date().toISOString(),
                  },
                });

                setBlob(newBlob);
                setMessage('Upload successful! 🎉');
              } catch (error) {
                console.error('Upload error:', error);
                setMessage(`Error: ${error instanceof Error ? error.message : 'Upload failed'}`);
              } finally {
                setIsUploading(false);
              }
            }}
            className="space-y-6"
          >
            <div>
              <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
                Select Video File
              </label>
              <input 
                name="file" 
                ref={inputFileRef} 
                type="file" 
                accept="video/*"
                required 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Supported formats: MP4, MOV, AVI, WebM, MKV (max 200MB)
              </p>
            </div>

            <button 
              type="submit" 
              disabled={isUploading}
              className={`w-full px-6 py-3 rounded-md font-medium text-white ${
                isUploading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              }`}
            >
              {isUploading ? "Uploading..." : "Upload Video"}
            </button>
          </form>

          {blob && (
            <div className="mt-8 p-6 bg-green-50 rounded-lg border border-green-200">
              <h3 className="text-lg font-medium text-green-900 mb-4">Upload Successful!</h3>
              <div className="space-y-2 text-sm">
                <p><strong>URL:</strong> <a href={blob.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">{blob.url}</a></p>
                <p><strong>Pathname:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{blob.pathname}</code></p>
                <p><strong>Size:</strong> {(blob.size / (1024 * 1024)).toFixed(2)} MB</p>
                <p><strong>Uploaded:</strong> {new Date(blob.uploadedAt).toLocaleString()}</p>
                <p><strong>Download URL:</strong> <a href={blob.downloadUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">{blob.downloadUrl}</a></p>
              </div>
              
              {blob.url && (
                <div className="mt-4">
                  <h4 className="font-medium text-green-900 mb-2">Video Preview:</h4>
                  <video 
                    src={blob.url} 
                    controls 
                    className="w-full max-h-64 rounded-lg"
                  />
                </div>
              )}
            </div>
          )}

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-medium text-blue-900 mb-2">ℹ️ How Client Uploads Work</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Files upload directly from browser to Vercel Blob</li>
              <li>• No server bandwidth usage for large files</li>
              <li>• Automatic multipart uploads for files >100MB</li>
              <li>• Better performance and reliability</li>
              <li>• Server only handles token generation and completion callbacks</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
