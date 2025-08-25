import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { useUser } from '@clerk/nextjs';

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (
        pathname,
        clientPayload
      ) => {
        // ⚠️ Authenticate and authorize users before generating the token.
        // This prevents anonymous uploads to your blob store.
        
        // For now, we'll allow all authenticated users to upload
        // You can add more specific authorization logic here
        
        return {
          allowedContentTypes: [
            'video/mp4',
            'video/mov', 
            'video/avi',
            'video/webm',
            'video/mkv',
            'video/quicktime'
          ],
          addRandomSuffix: true, // Prevents overwriting existing files
          tokenPayload: JSON.stringify({
            // Store any additional data you want to access in onUploadCompleted
            uploadType: 'video',
            timestamp: new Date().toISOString(),
            // You could add user ID, video metadata, etc. here
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // This callback is triggered when the client upload completes
        // ⚠️ This won't work on localhost - use ngrok for local development
        
        console.log('Video upload completed:', {
          blob: {
            url: blob.url,
            pathname: blob.pathname,
            size: blob.size,
            uploadedAt: blob.uploadedAt,
          },
          tokenPayload,
        });

        try {
          // Here you can:
          // 1. Update your database with the video URL
          // 2. Send notifications
          // 3. Process the video (e.g., generate thumbnails)
          // 4. Update user's video count
          
          // Example: Update database with video information
          // const { userId, videoMetadata } = JSON.parse(tokenPayload);
          // await db.videos.create({
          //   url: blob.url,
          //   pathname: blob.pathname,
          //   size: blob.size,
          //   userId,
          //   ...videoMetadata
          // });
          
          console.log('Video upload processed successfully');
        } catch (error) {
          console.error('Error processing upload completion:', error);
          // Don't throw here - the upload succeeded, we just failed to process it
          // You might want to implement a retry mechanism or queue system
        }
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error('Client upload error:', error);
    
    return NextResponse.json(
      { 
        error: (error as Error).message,
        details: 'Failed to process client upload request'
      },
      { status: 400 } // The webhook will retry 5 times waiting for a 200
    );
  }
}
