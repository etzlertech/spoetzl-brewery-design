# Upload Images to Supabase

This guide will help you upload the Busch Gardens inspiration images from your repository to Supabase storage.

## Found Images

23 Busch Gardens inspiration images were found in:
```
Busch-Gardens-Williamsburg-Research/images/
```

## Step 1: Get Your Supabase API Key

1. Visit your Supabase dashboard: https://supabase.com/dashboard/project/armklbqsjcmrhqljmacz
2. Click on **Settings** in the left sidebar (at the bottom)
3. Click on **API** in the settings menu
4. Copy the **`anon` `public`** key (it starts with `eyJ...`)

## Step 2: Install Dependencies

```bash
cd "C:\Users\TravisEtzler\Documents\GitHub\Spoetzl Brewery Landscape Design system\spoetzl-brewery-app"
npm install @supabase/supabase-js
```

## Step 3: Run the Upload Script

```bash
SUPABASE_ANON_KEY=your-key-here node scripts/upload-images-to-supabase.mjs
```

Replace `your-key-here` with the API key you copied in Step 1.

### Windows PowerShell

```powershell
$env:SUPABASE_ANON_KEY="your-key-here"
node scripts/upload-images-to-supabase.mjs
```

### Windows Command Prompt

```cmd
set SUPABASE_ANON_KEY=your-key-here
node scripts/upload-images-to-supabase.mjs
```

## What the Script Does

The script will:
1. Read all 23 images from `Busch-Gardens-Williamsburg-Research/images/`
2. Upload each image to the `images` bucket in the `inspiration/` folder
3. Display progress and public URLs for each uploaded image
4. Provide a summary of successful and failed uploads

## Expected Output

```
Starting image upload to Supabase...
Reading images from: C:\Users\TravisEtzler\Documents\GitHub\Spoetzl Brewery Landscape Design system\Busch-Gardens-Williamsburg-Research\images

Found 23 images to upload

Uploading: 01-theme-park-landscape.jpg...
  ✓ Success: inspiration/01-theme-park-landscape.jpg
  📍 URL: https://armklbqsjcmrhqljmacz.supabase.co/storage/v1/object/public/images/inspiration/01-theme-park-landscape.jpg

...

════════════════════════════════════════════════════════════
Upload complete!
✓ Uploaded: 23
✗ Failed: 0
Total: 23
════════════════════════════════════════════════════════════
```

## After Upload

Once uploaded, your images will be accessible at:
```
https://armklbqsjcmrhqljmacz.supabase.co/storage/v1/object/public/images/inspiration/{filename}
```

You can view them in the Supabase dashboard:
https://supabase.com/dashboard/project/armklbqsjcmrhqljmacz/storage/buckets/images

## Troubleshooting

### Error: SUPABASE_ANON_KEY environment variable is required
Make sure you set the environment variable before running the script.

### Error: bucket not found
Verify that the `images` bucket exists in your Supabase storage.

### Error: permission denied
Ensure your buckets are set to PUBLIC, or you're using the correct API key.

## Next Steps

After uploading, you may want to:
1. Delete the local images from the repository to save space
2. Update any code that references local images to use the Supabase URLs
3. Create a database table to store image metadata (titles, descriptions, categories)
