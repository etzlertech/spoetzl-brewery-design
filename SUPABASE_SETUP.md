# Supabase Setup - Spoetzl Brewery Design

## Project Information

**Project Name:** Spoetzl Brewery Design
**Project ID:** `armklbqsjcmrhqljmacz`
**Project URL:** https://armklbqsjcmrhqljmacz.supabase.co
**Region:** East US (Ohio) - us-east-2
**Compute Size:** MICRO
**Status:** Currently provisioning

## Dashboard Access

**Supabase Dashboard:** https://supabase.com/dashboard/project/armklbqsjcmrhqljmacz
**Project Settings:** https://supabase.com/dashboard/project/armklbqsjcmrhqljmacz/settings/general
**API Settings:** https://supabase.com/dashboard/project/armklbqsjcmrhqljmacz/settings/api

## API Keys (Available once project finishes provisioning)

Once your project finishes provisioning (usually takes 1-2 minutes), you'll find your API keys at:
**Settings → API Keys**

You'll need these environment variables for your Next.js app:

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://armklbqsjcmrhqljmacz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

## Database Connection String

The database connection string will be available at:
**Settings → Database**

Format:
```
postgresql://postgres.[project-id]:[password]@aws-0-us-east-2.pooler.supabase.com:6543/postgres
```

## Storage Buckets

The following storage buckets have been created and configured as **PUBLIC** for easy access:

### Created Buckets

| Bucket Name | Status | Access | File Size Limit | Use Case |
|------------|--------|--------|----------------|----------|
| **images** | PUBLIC | Read: Public<br>Write: Authenticated | 50 MB | Brewery photos, design mockups, inspiration images, Busch Gardens references |
| **videos** | PUBLIC | Read: Public<br>Write: Authenticated | 50 MB | Design walkthroughs, inspiration videos, 3D renderings |
| **models-3d** | PUBLIC | Read: Public<br>Write: Authenticated | 50 MB | STL files, CAD files, SketchUp models for interactive 3D viewing |
| **documents** | PUBLIC | Read: Public<br>Write: Authenticated | 50 MB | PDFs, design plans, specifications, documentation |

### Bucket Organization Strategy

Within each bucket, organize files using folders:
- `inspiration/` - Busch Gardens and other inspiration content
- `design-zone/` - Active design work and proposals
- `archive/` - Historical content and completed projects
- `raw/` - Unprocessed uploads awaiting categorization

### Storage URLs

Access files using these patterns:
```
https://armklbqsjcmrhqljmacz.supabase.co/storage/v1/object/public/images/{filename}
https://armklbqsjcmrhqljmacz.supabase.co/storage/v1/object/public/videos/{filename}
https://armklbqsjcmrhqljmacz.supabase.co/storage/v1/object/public/models-3d/{filename}
https://armklbqsjcmrhqljmacz.supabase.co/storage/v1/object/public/documents/{filename}
```

## Next Steps

### 1. Wait for Project to Finish Provisioning
The project is currently being set up. This usually takes 1-2 minutes.

### 2. Install Supabase Client Library
```bash
cd "C:\Users\TravisEtzler\Documents\GitHub\Spoetzl Brewery Landscape Design system\spoetzl-brewery-app"
npm install @supabase/supabase-js
```

### 3. Create Database Tables
Navigate to **Table Editor** in your Supabase dashboard and create tables for:
- `images` - Store uploaded images with metadata
- `videos` - Video content and links
- `maps` - Map images and design layouts
- `plans` - Design plans and specifications
- `enhancements` - Busch Gardens inspired enhancement ideas
- `users` - User authentication (if using Supabase Auth)

### 4. Storage Buckets (COMPLETED ✓)
The following buckets have been created and configured:
- ✓ `images` - Image uploads (brewery photos, design mockups, inspiration)
- ✓ `videos` - Video files and 3D rendering walkthroughs
- ✓ `models-3d` - STL files, CAD files, SketchUp models
- ✓ `documents` - PDFs, plans, specifications

All buckets are configured as PUBLIC with 50 MB file size limit.

### 5. Configure Authentication
Navigate to **Authentication** → **Providers** to enable:
- Email/Password authentication
- Google OAuth (optional)
- GitHub OAuth (optional)

### 6. Update Your Next.js App

Create `lib/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### 7. Example: Create an Image Upload Function

```typescript
// lib/uploadImage.ts
import { supabase } from './supabase'

export async function uploadImage(file: File, bucket: string = 'images') {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random()}.${fileExt}`
  const filePath = `${fileName}`

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file)

  if (error) {
    throw error
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath)

  return { path: data.path, publicUrl }
}
```

### 8. Example: Query Database

```typescript
// Get all images
const { data: images, error } = await supabase
  .from('images')
  .select('*')
  .order('created_at', { ascending: false })

// Insert new image
const { data, error } = await supabase
  .from('images')
  .insert([
    {
      title: 'Brewery Landscape',
      description: 'North garden area',
      url: publicUrl,
      category: 'landscape'
    }
  ])
```

## Database Schema Suggestion

```sql
-- Images table
create table images (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  url text not null,
  category text check (category in ('landscape', 'architecture', 'interior', 'busch-gardens')),
  tags text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users
);

-- Enable Row Level Security
alter table images enable row level security;

-- Allow public read access
create policy "Images are viewable by everyone"
  on images for select
  using (true);

-- Allow authenticated users to insert
create policy "Authenticated users can insert images"
  on images for insert
  with check (auth.role() = 'authenticated');
```

## Resources

- **Supabase Documentation:** https://supabase.com/docs
- **Supabase JS Client Docs:** https://supabase.com/docs/reference/javascript/introduction
- **Next.js + Supabase Guide:** https://supabase.com/docs/guides/getting-started/quickstarts/nextjs

## Support

- **Supabase Dashboard:** https://supabase.com/dashboard
- **Supabase Discord:** https://discord.supabase.com
- **Supabase GitHub:** https://github.com/supabase/supabase

---

**Created:** March 7, 2026
**Last Updated:** March 7, 2026
**Project Status:** Active
**Storage Buckets:** ✓ Created (images, videos, models-3d, documents)
**Next Action:** Copy API keys from dashboard and add to .env.local file
