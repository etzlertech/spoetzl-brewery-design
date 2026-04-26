import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client with service role key (bypasses RLS)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://armklbqsjcmrhqljmacz.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Constants
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * POST /api/camera-capture
 * Uploads an image from camera/gallery to Supabase storage
 * Accepts all image formats: JPEG, PNG, WebP, HEIC, GIF, BMP, TIFF, etc.
 *
 * Request: FormData with 'image' file
 * Response: { url: string } or { error: string }
 */
export async function POST(request: NextRequest) {
  try {
    if (!supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Photo upload is not configured. Missing SUPABASE_SERVICE_ROLE_KEY.' },
        { status: 503 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse FormData
    let formData: FormData;

    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json(
        { error: 'Invalid upload request. Please submit image form data.' },
        { status: 400 }
      );
    }

    const file = formData.get('image') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    // Validate file type - accept all image/* types
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload an image file.' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum size is 10MB.` },
        { status: 400 }
      );
    }

    // Extract file extension - preserve original extension for all image types
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    if (!fileExt) {
      return NextResponse.json(
        { error: 'Invalid file name' },
        { status: 400 }
      );
    }

    // Generate unique filename: capture-{timestamp}-{uuid}.{ext}
    const timestamp = Date.now();
    const uuid = crypto.randomUUID();
    const filename = `capture-${timestamp}-${uuid}.${fileExt}`;
    const storagePath = `camera-captures/${filename}`;

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Upload to Supabase storage
    const { error } = await supabase.storage
      .from('images')
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return NextResponse.json(
        { error: `Upload failed: ${error.message}` },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(storagePath);

    console.log(`Camera capture uploaded: ${filename} (${(file.size / 1024).toFixed(1)}KB)`);

    return NextResponse.json({ url: publicUrl }, { status: 200 });

  } catch (error) {
    console.error('Camera capture API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
