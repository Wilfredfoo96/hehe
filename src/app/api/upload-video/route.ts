import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

// Configure maximum file size (200MB)
const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB in bytes

// Recommended multipart upload threshold (100MB)
const MULTIPART_THRESHOLD = 100 * 1024 * 1024; // 100MB

export async function POST(request: NextRequest) {
  try {
    // Check content length header first
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > MAX_FILE_SIZE) {
      return NextResponse.json(
        { 
          error: 'File size too large', 
          maxSize: '200MB',
          receivedSize: `${(parseInt(contentLength) / (1024 * 1024)).toFixed(2)}MB`
        },
        { status: 413 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('video') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No video file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('video/')) {
      return NextResponse.json(
        { 
          error: 'Invalid file type. Only video files are allowed.',
          receivedType: file.type
        },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { 
          error: 'File size too large. Maximum size is 200MB.',
          maxSize: '200MB',
          receivedSize: `${(file.size / (1024 * 1024)).toFixed(2)}MB`
        },
        { status: 413 }
      );
    }

    // Additional file size validation (safety check)
    if (file.size === 0) {
      return NextResponse.json(
        { error: 'File is empty' },
        { status: 400 }
      );
    }

    // Generate organized filename with date-based folder structure
    const now = new Date();
    const dateFolder = now.toISOString().split('T')[0]; // YYYY-MM-DD format
    const timestamp = now.getTime();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    
    // Create organized folder structure: videos/YYYY-MM-DD/timestamp-random-filename
    const filename = `videos/${dateFolder}/${timestamp}-${randomSuffix}-${sanitizedName}`;
    
    console.log(`Uploading file: ${filename}, Size: ${(file.size / (1024 * 1024)).toFixed(2)}MB, Type: ${file.type}`);

    // Configure upload options based on file size and type
    const uploadOptions = {
      access: 'public' as const,
      addRandomSuffix: false, // We're already adding our own random suffix
      // Enable multipart uploads for files larger than 100MB (better performance)
      multipart: file.size > MULTIPART_THRESHOLD,
      // Set cache control for videos (1 month default, but can be customized)
      cacheControlMaxAge: 60 * 60 * 24 * 30, // 30 days in seconds
    };

    // Upload to Vercel Blob
    const blob = await put(filename, file, uploadOptions);

    console.log(`Upload successful: ${blob.url}`);
    console.log(`Blob details:`, {
      pathname: blob.pathname,
      size: blob.size,
      uploadedAt: blob.uploadedAt,
      url: blob.url
    });

    return NextResponse.json({
      success: true,
      url: blob.url,
      filename: filename,
      pathname: blob.pathname,
      size: file.size,
      type: file.type,
      uploadedAt: blob.uploadedAt,
      // Include download URL for force-download scenarios
      downloadUrl: blob.downloadUrl,
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('too large') || error.message.includes('413')) {
        return NextResponse.json(
          { 
            error: 'File size too large for processing',
            maxSize: '200MB'
          },
          { status: 413 }
        );
      }
      
      if (error.message.includes('network') || error.message.includes('timeout')) {
        return NextResponse.json(
          { error: 'Upload timeout. Please try again with a smaller file.' },
          { status: 408 }
        );
      }

      // Handle Vercel Blob specific errors
      if (error.message.includes('BLOB_ACCESS_DENIED')) {
        return NextResponse.json(
          { error: 'Access denied. Please check your Vercel Blob configuration.' },
          { status: 403 }
        );
      }

      if (error.message.includes('BLOB_STORE_NOT_FOUND')) {
        return NextResponse.json(
          { error: 'Blob store not found. Please configure Vercel Blob for your project.' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { 
        error: 'Failed to upload video. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Unknown error' : undefined
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
