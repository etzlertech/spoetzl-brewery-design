# Intelligent Image Downloader - Implementation Plan

**Created:** March 7, 2026
**Project:** Spoetzl Brewery Landscape Design System
**Feature:** Multi-source intelligent image downloader for Busch Gardens research

---

## Executive Summary

Design and implement an intelligent CLI-based image downloader that fetches landscaping and themed environment images from multiple sources (official websites, stock photo APIs, plant databases) and stores them in Supabase Storage with intelligent organization and metadata.

---

## Current State Analysis

### Existing Infrastructure

**Supabase Integration** (`lib/supabase.ts`):
- ✅ Supabase client configured
- ✅ URL: `armklbqsjcmrhqljmacz.supabase.co`
- ✅ Storage bucket: `images`
- ✅ Current folder: `inspiration/`

**Existing Upload Script** (`scripts/upload-images-to-supabase.mjs`):
- ✅ Reads from local directory
- ✅ Supports: jpg, jpeg, png, gif, webp
- ✅ Uploads with upsert (overwrites existing)
- ✅ Generates public URLs
- ⚠️ Limited to local files only
- ⚠️ No intelligent categorization
- ⚠️ No duplicate detection

**Visual Assets** (`public/research/images/`):
- ✅ 23 existing reference images (6.8 MB)
- ✅ Downloaded from Unsplash
- ✅ Organized by category
- ✅ IMAGE-INDEX.md documentation
- ⚠️ Manual download process (PowerShell script)

**Research Documentation**:
- ✅ 150+ curated URLs (`visual-assets-urls.md`)
- ✅ Comprehensive themed areas research
- ✅ Plant lists and landscape details
- ✅ Categorization by themed area, season, feature type

---

## Requirements Summary

### Image Sources (Priority Order)

1. **Free Stock Photo APIs** (No cost, unlimited):
   - Unsplash API
   - Pexels API
   - Pixabay API

2. **Wikimedia Commons / Wikipedia** (Free, public domain):
   - Wikimedia Commons API
   - Wikipedia image extraction

3. **Official Busch Gardens Website** (Ethical scraping):
   - Public pages only
   - Respect robots.txt
   - Rate-limited requests
   - Press kit images (attribution required)

4. **Google Images Search API** (Paid, optional):
   - Google Custom Search API
   - Requires API key + billing
   - 100 free searches/day

5. **Plant Database APIs** (Free tiers):
   - Trefle API (plant data + images)
   - Perenual API (plant care + images)
   - PlantNet API (plant identification)

### Storage & Organization

**Supabase Storage Structure**:
```
images/
├── busch-gardens/
│   ├── themed-areas/
│   │   ├── england/
│   │   ├── scotland/
│   │   ├── ireland/
│   │   ├── france-aquitaine/
│   │   ├── france-new-france/
│   │   ├── germany-rhinefeld/
│   │   ├── germany-oktoberfest/
│   │   ├── italy-san-marco/
│   │   └── italy-festa-italia/
│   ├── landscape/
│   │   ├── spring/
│   │   ├── summer/
│   │   ├── fall/
│   │   └── winter/
│   ├── architecture/
│   ├── water-features/
│   ├── bridges/
│   └── seasonal-events/
│       ├── christmas-town/
│       └── howl-o-scream/
├── plants/
│   ├── by-species/
│   └── by-region/
└── inspiration/
    └── [existing 23 images]
```

### CLI Interface

**Main Commands**:
```bash
# Download all images from all sources
npm run download-images

# Download from specific source
npm run download-images -- --source=unsplash
npm run download-images -- --source=pexels
npm run download-images -- --source=wikimedia
npm run download-images -- --source=plants

# Download specific categories
npm run download-images -- --category=landscape
npm run download-images -- --category=architecture
npm run download-images -- --themed-area=germany

# Limit downloads
npm run download-images -- --limit=50
npm run download-images -- --source=unsplash --limit=20

# Dry run (preview without downloading)
npm run download-images -- --dry-run

# Resume interrupted downloads
npm run download-images -- --resume
```

---

## Implementation Design

### Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    CLI Entry Point                       │
│           (scripts/download-images.ts)                   │
└────────────────────┬────────────────────────────────────┘
                     │
          ┌──────────┴──────────┐
          │                     │
┌─────────▼──────────┐  ┌──────▼────────────────────┐
│  Source Manager    │  │  Storage Manager          │
│  - API clients     │  │  - Supabase upload        │
│  - Rate limiting   │  │  - Duplicate detection    │
│  - Error handling  │  │  - Metadata storage       │
└─────────┬──────────┘  └──────▲────────────────────┘
          │                     │
          │                     │
          │            ┌────────┴────────┐
          │            │                 │
          │    ┌───────▼──────┐  ┌──────▼────────┐
          │    │  Image       │  │  Categorizer  │
          │    │  Processor   │  │  - Auto-tag   │
          │    │  - Resize    │  │  - Classify   │
          │    │  - Optimize  │  │  - Extract    │
          │    │  - Validate  │  │    metadata   │
          │    └──────────────┘  └───────────────┘
          │
┌─────────▼────────────────────────────────────────────┐
│               Source Adapters                         │
├──────────────┬──────────────┬──────────────┬─────────┤
│   Unsplash   │    Pexels    │   Pixabay    │  Wiki   │
│   Adapter    │   Adapter    │   Adapter    │ Adapter │
└──────────────┴──────────────┴──────────────┴─────────┘
```

### Core Components

#### 1. Source Manager (`lib/image-sources/`)

**Purpose**: Manage multiple image source APIs with unified interface

**Files**:
- `source-manager.ts` - Main orchestrator
- `sources/unsplash.ts` - Unsplash API client
- `sources/pexels.ts` - Pexels API client
- `sources/pixabay.ts` - Pixabay API client
- `sources/wikimedia.ts` - Wikimedia Commons client
- `sources/plants.ts` - Plant database APIs aggregator
- `sources/types.ts` - Shared TypeScript interfaces

**Key Features**:
- Unified `ImageSource` interface for all sources
- Rate limiting (per-source limits)
- API key management from .env
- Error handling and retries
- Progress tracking

**Search Strategy**:
```typescript
interface SearchParams {
  query: string;           // e.g., "busch gardens williamsburg landscape"
  category?: string;       // landscape, architecture, water-features
  themedArea?: string;     // england, scotland, germany, etc.
  season?: string;         // spring, summer, fall, winter
  minResolution?: number;  // minimum pixels
  limit?: number;          // max results
}
```

**Search Queries by Category**:
- **Landscape**: "theme park gardens", "seasonal flower beds", "tulip displays", "formal gardens"
- **Architecture**: "european village", "tudor architecture", "bavarian buildings", "renaissance italy"
- **Water Features**: "decorative fountains", "river cruise", "water gardens", "bridge architecture"
- **Themed Areas**: "{country} village", "{country} architecture", "{country} landscape"
- **Plants**: "violas", "pansies", "petunias", "salvias" (from research doc plant lists)

#### 2. Storage Manager (`lib/storage/`)

**Purpose**: Handle Supabase Storage operations with intelligence

**Files**:
- `storage-manager.ts` - Main storage orchestrator
- `duplicate-detector.ts` - Check for existing images
- `metadata-manager.ts` - Store/retrieve image metadata
- `categorizer.ts` - Auto-categorize images

**Key Features**:
- **Duplicate Detection**:
  - Hash-based (compare file hashes)
  - Visual similarity (using image-hash library)
  - Filename matching
  - URL tracking (don't re-download same URL)

- **Metadata Storage**:
  ```json
  {
    "id": "uuid",
    "filename": "germany-oktoberfest-001.jpg",
    "source": "unsplash",
    "sourceUrl": "https://unsplash.com/photos/...",
    "category": "themed-areas/germany-oktoberfest",
    "tags": ["germany", "oktoberfest", "architecture", "bavarian"],
    "resolution": "1920x1080",
    "fileSize": 245678,
    "uploadedAt": "2026-03-07T10:30:00Z",
    "supabasePath": "busch-gardens/themed-areas/germany-oktoberfest/germany-oktoberfest-001.jpg",
    "publicUrl": "https://armklbqsjcmrhqljmacz.supabase.co/storage/v1/object/public/images/...",
    "attribution": "Photo by John Doe on Unsplash"
  }
  ```

- **Auto-Categorization**:
  - Keyword matching from search query
  - Image analysis (optional, using vision API)
  - Filename parsing
  - Manual override option

#### 3. Image Processor (`lib/image-processing/`)

**Purpose**: Optimize and validate images before upload

**Files**:
- `image-processor.ts` - Main image processing
- `image-optimizer.ts` - Resize/compress using browser-image-compression
- `image-validator.ts` - Check quality, resolution, format

**Key Features**:
- **Optimization**:
  - Resize to max 2400px width (preserve aspect ratio)
  - Compress to target ~300-500KB per image
  - Convert to WebP format (optional, with JPEG fallback)
  - Strip unnecessary EXIF data (keep attribution)

- **Validation**:
  - Minimum resolution: 1200px width
  - Supported formats: JPG, PNG, WebP
  - Maximum file size: 5MB (before compression)
  - Image quality check (reject blurry/low-quality)

#### 4. Plant Database Integration (`lib/plants/`)

**Purpose**: Fetch plant identification images and data

**Files**:
- `trefle-client.ts` - Trefle API integration
- `perenual-client.ts` - Perenual API integration
- `plantnet-client.ts` - PlantNet API integration

**Target Plants** (from themed-areas-research.md):
- **Spring**: violas, pansies, dusty miller, calibrachoas, snap dragons, dianthus, petunias, agryanthemums, cyclamens, osteos, euphorbias, geraniums, lobelias, green/variegated ivies
- **Summer**: hibiscus, salvias, begonias, marigolds
- **Trees**: crape myrtles (650+)
- **European natives**: research-specific plants

**Search Strategy**:
1. Query each API for plant name
2. Download primary image (highest quality)
3. Store in `plants/by-species/{scientific-name}/`
4. Save plant data as JSON metadata

#### 5. CLI Interface (`scripts/download-images.ts`)

**Purpose**: User-friendly command-line interface

**Features**:
- Argument parsing (using minimist or yargs)
- Interactive prompts (using inquirer)
- Progress bars (using cli-progress)
- Color-coded output (using chalk)
- Detailed logging (using winston or pino)

**Example Output**:
```
🌿 Busch Gardens Image Downloader v1.0.0

📊 Configuration:
  Source: unsplash
  Category: landscape
  Limit: 50 images
  Dry Run: false

🔍 Searching Unsplash for "busch gardens landscape"...
  ✓ Found 127 results

📥 Downloading images:
  [████████████████████████████████████] 50/50 | ETA: 0s

✅ Download Summary:
  • Downloaded: 45 images
  • Skipped (duplicates): 5 images
  • Total size: 12.3 MB
  • Uploaded to: busch-gardens/landscape/
  • Failed: 0

🔗 View images: https://armklbqsjcmrhqljmacz.supabase.co/storage/v1/object/public/images/busch-gardens/landscape/
```

---

## API Integrations

### 1. Unsplash API

**Library**: `unsplash-js`
**Docs**: https://unsplash.com/documentation
**Free Tier**: 50 requests/hour
**API Key**: `UNSPLASH_ACCESS_KEY` in .env

**Search Queries**:
```typescript
const queries = [
  'theme park gardens landscaping',
  'european village architecture',
  'formal gardens flowers',
  'bavaria germany oktoberfest',
  'scottish highlands landscape',
  'french chateau gardens',
  'italian renaissance architecture',
  'seasonal flower beds display',
  'christmas lights display',
  'decorative fountain european'
];
```

**Implementation**:
```typescript
import { createApi } from 'unsplash-js';

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY!
});

const results = await unsplash.search.getPhotos({
  query: 'theme park gardens',
  perPage: 30,
  orientation: 'landscape'
});
```

### 2. Pexels API

**Library**: `pexels`
**Docs**: https://www.pexels.com/api/documentation/
**Free Tier**: 200 requests/hour
**API Key**: `PEXELS_API_KEY` in .env

**Implementation**:
```typescript
import { createClient } from 'pexels';

const client = createClient(process.env.PEXELS_API_KEY!);

const results = await client.photos.search({
  query: 'european gardens',
  per_page: 30,
  orientation: 'landscape'
});
```

### 3. Pixabay API

**Library**: Direct fetch (no official SDK)
**Docs**: https://pixabay.com/api/docs/
**Free Tier**: 100 requests/minute
**API Key**: `PIXABAY_API_KEY` in .env

**Implementation**:
```typescript
const response = await fetch(
  `https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&per_page=30`
);
const data = await response.json();
```

### 4. Wikimedia Commons API

**Library**: Direct fetch
**Docs**: https://commons.wikimedia.org/w/api.php
**Free Tier**: Unlimited (rate limit 200 req/sec)
**API Key**: None required

**Search Strategy**:
- Search for "Busch Gardens Williamsburg" category
- Search for specific themed areas
- Search for plant species images

**Implementation**:
```typescript
const response = await fetch(
  `https://commons.wikimedia.org/w/api.php?action=query&list=categorymembers&cmtitle=Category:Busch_Gardens_Williamsburg&cmlimit=50&format=json`
);
```

### 5. Plant Database APIs

#### Trefle API
**Docs**: https://docs.trefle.io/
**Free Tier**: 120 requests/day
**API Key**: `TREFLE_API_KEY` in .env

```typescript
const response = await fetch(
  `https://trefle.io/api/v1/plants/search?token=${process.env.TREFLE_API_KEY}&q=${plantName}`
);
```

#### Perenual API
**Docs**: https://perenual.com/docs/api
**Free Tier**: 100 requests/day
**API Key**: `PERENUAL_API_KEY` in .env

```typescript
const response = await fetch(
  `https://perenual.com/api/species-list?key=${process.env.PERENUAL_API_KEY}&q=${plantName}`
);
```

#### PlantNet API
**Docs**: https://my.plantnet.org/
**Free Tier**: Research use
**API Key**: `PLANTNET_API_KEY` in .env

---

## File Structure

```
spoetzl-brewery-app/
├── lib/
│   ├── supabase.ts                    [existing]
│   ├── image-sources/
│   │   ├── source-manager.ts          [new] Main orchestrator
│   │   ├── types.ts                   [new] Shared interfaces
│   │   └── sources/
│   │       ├── unsplash.ts            [new] Unsplash client
│   │       ├── pexels.ts              [new] Pexels client
│   │       ├── pixabay.ts             [new] Pixabay client
│   │       ├── wikimedia.ts           [new] Wikimedia client
│   │       └── plants.ts              [new] Plant APIs aggregator
│   ├── storage/
│   │   ├── storage-manager.ts         [new] Supabase operations
│   │   ├── duplicate-detector.ts      [new] Duplicate checking
│   │   ├── metadata-manager.ts        [new] Metadata handling
│   │   └── categorizer.ts             [new] Auto-categorization
│   ├── image-processing/
│   │   ├── image-processor.ts         [new] Main processor
│   │   ├── image-optimizer.ts         [new] Resize/compress
│   │   └── image-validator.ts         [new] Quality checks
│   └── plants/
│       ├── trefle-client.ts           [new] Trefle integration
│       ├── perenual-client.ts         [new] Perenual integration
│       └── plantnet-client.ts         [new] PlantNet integration
├── scripts/
│   ├── upload-images-to-supabase.mjs  [existing]
│   └── download-images.ts             [new] CLI entry point
├── .env.local                         [update] Add API keys
├── package.json                       [update] Add dependencies
└── README.md                          [update] Document usage
```

---

## Dependencies to Install

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.98.0",      // [existing]
    "browser-image-compression": "^2.0.2",    // [existing]
    "dotenv": "^17.3.1",                      // [existing]
    "exifr": "^7.1.3",                        // [existing]

    // Image download & processing
    "axios": "^1.7.0",                        // [new] HTTP requests
    "image-hash": "^7.0.0",                   // [new] Duplicate detection
    "sharp": "^0.33.0",                       // [new] Image optimization

    // API clients
    "unsplash-js": "^7.0.19",                 // [new] Unsplash SDK
    "pexels": "^1.4.0",                       // [new] Pexels SDK

    // CLI utilities
    "yargs": "^17.7.2",                       // [new] Argument parsing
    "inquirer": "^11.2.0",                    // [new] Interactive prompts
    "cli-progress": "^3.12.0",                // [new] Progress bars
    "chalk": "^5.4.0",                        // [new] Colored output
    "ora": "^8.1.3",                          // [new] Spinners

    // Utilities
    "p-limit": "^6.1.0",                      // [new] Concurrency control
    "p-retry": "^6.3.0",                      // [new] Retry logic
    "filenamify": "^6.0.0"                    // [new] Safe filenames
  },
  "devDependencies": {
    "@types/cli-progress": "^3.11.6",         // [new]
    "@types/inquirer": "^11.0.0",             // [new]
    "@types/sharp": "^0.32.0",                // [new]
    "@types/yargs": "^17.0.33"                // [new]
  }
}
```

---

## Environment Variables (.env.local)

```env
# Existing Supabase configuration
NEXT_PUBLIC_SUPABASE_URL=https://armklbqsjcmrhqljmacz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Image Source API Keys [NEW]
UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
PEXELS_API_KEY=your_pexels_api_key_here
PIXABAY_API_KEY=your_pixabay_api_key_here

# Plant Database API Keys [NEW]
TREFLE_API_KEY=your_trefle_api_key_here
PERENUAL_API_KEY=your_perenual_api_key_here
PLANTNET_API_KEY=your_plantnet_api_key_here

# Optional: Google Custom Search [NEW]
GOOGLE_CUSTOM_SEARCH_API_KEY=your_google_api_key_here
GOOGLE_CUSTOM_SEARCH_ENGINE_ID=your_search_engine_id_here
```

---

## Implementation Phases

### Phase 1: Core Infrastructure (Day 1-2)
**Goal**: Set up foundation with one working source

**Tasks**:
1. ✅ Install dependencies
2. ✅ Create file structure
3. ✅ Set up TypeScript interfaces (`types.ts`)
4. ✅ Implement Storage Manager basics
5. ✅ Implement Unsplash adapter (first source)
6. ✅ Create basic CLI (`download-images.ts`)
7. ✅ Test end-to-end: Unsplash → Supabase

**Deliverable**: Working CLI that downloads Unsplash images to Supabase

---

### Phase 2: Multi-Source Support (Day 3-4)
**Goal**: Add remaining free stock photo sources

**Tasks**:
1. ✅ Implement Pexels adapter
2. ✅ Implement Pixabay adapter
3. ✅ Implement Wikimedia adapter
4. ✅ Add source selection to CLI
5. ✅ Implement rate limiting
6. ✅ Add retry logic for failed downloads
7. ✅ Test each source individually

**Deliverable**: CLI supports 4 image sources with rate limiting

---

### Phase 3: Intelligence Layer (Day 5-6)
**Goal**: Add smart features (duplicates, categorization, optimization)

**Tasks**:
1. ✅ Implement duplicate detection (hash-based)
2. ✅ Implement auto-categorization
3. ✅ Implement image optimization (resize/compress)
4. ✅ Implement metadata management
5. ✅ Add progress tracking
6. ✅ Add dry-run mode
7. ✅ Test duplicate detection accuracy

**Deliverable**: Intelligent downloader with deduplication and auto-categorization

---

### Phase 4: Plant Database Integration (Day 7-8)
**Goal**: Add plant-specific image downloading

**Tasks**:
1. ✅ Implement Trefle API client
2. ✅ Implement Perenual API client
3. ✅ Implement PlantNet API client
4. ✅ Parse plant lists from research docs
5. ✅ Create plant image downloader
6. ✅ Store plant metadata (care info, zones, etc.)
7. ✅ Test with subset of plants

**Deliverable**: Plant database integration with metadata

---

### Phase 5: Advanced Features (Day 9-10)
**Goal**: Polish and enhance UX

**Tasks**:
1. ✅ Add resume capability (interrupted downloads)
2. ✅ Add search query customization
3. ✅ Add themed area filtering
4. ✅ Add seasonal filtering
5. ✅ Improve CLI output (colors, progress bars)
6. ✅ Add comprehensive error handling
7. ✅ Write documentation

**Deliverable**: Production-ready CLI tool with full features

---

### Phase 6: Testing & Documentation (Day 11-12)
**Goal**: Ensure reliability and usability

**Tasks**:
1. ✅ Integration testing (all sources)
2. ✅ Performance testing (concurrent downloads)
3. ✅ Error scenario testing (API failures, rate limits)
4. ✅ Update README with usage examples
5. ✅ Create API key setup guide
6. ✅ Add troubleshooting section
7. ✅ Create sample .env.example file

**Deliverable**: Fully tested and documented tool

---

## Search Query Strategy

### Themed Area Queries

**England (Banbury Cross)**:
- "tudor architecture england"
- "english village cottages"
- "globe theatre london"
- "english gardens formal"
- "red telephone booth england"

**Scotland (Heatherdowns)**:
- "scottish highlands landscape"
- "highland village architecture"
- "scottish stone buildings"
- "heather moorland scotland"
- "scottish sheep farms"

**Ireland (Killarney)**:
- "irish village thatched roof"
- "ireland countryside cottage"
- "celtic architecture ireland"
- "irish gardens landscape"
- "killarney ireland scenery"

**France - Aquitaine**:
- "french chateau architecture"
- "french formal gardens"
- "lavender fields france"
- "vineyard landscape france"
- "renaissance french architecture"

**France - New France**:
- "canadian log cabin frontier"
- "french colonial architecture"
- "fur trade post historical"
- "wilderness cabin canada"

**Germany - Rhinefeld**:
- "bavarian alpine village"
- "german chalet architecture"
- "alpine mountain village"
- "ski resort bavarian"

**Germany - Oktoberfest**:
- "oktoberfest bavaria germany"
- "german beer hall munich"
- "bavarian festival architecture"
- "german fountain traditional"

**Italy - San Marco**:
- "venice renaissance architecture"
- "italian piazza fountain"
- "venetian bridges canals"
- "renaissance italy gardens"

**Italy - Festa Italia**:
- "italian festival marketplace"
- "roman architecture ruins"
- "italian village celebration"

### Landscape & Seasonal Queries

**Spring**:
- "spring tulip garden display"
- "flower beds spring bulbs"
- "pansy viola spring flowers"
- "spring garden landscaping"

**Summer**:
- "summer annual flowers garden"
- "hibiscus salvia begonia garden"
- "colorful summer flower beds"
- "marigold petunia garden"

**Fall**:
- "autumn garden chrysanthemums"
- "fall foliage garden display"
- "autumn flower beds landscape"

**Winter/Christmas**:
- "christmas lights garden display"
- "holiday light show outdoor"
- "winter garden illumination"
- "christmas tree lights spectacular"

### Water Features & Architecture

**Water**:
- "decorative fountain european"
- "river cruise scenic landscape"
- "water feature garden design"
- "ornamental fountain plaza"

**Bridges**:
- "pedestrian bridge landscape"
- "garden bridge architecture"
- "scenic bridge overlook"

**General Architecture**:
- "european village architecture"
- "themed environment design"
- "cobblestone street european"
- "historic village buildings"

---

## Quality Criteria

### Image Quality Standards

**Resolution**:
- Minimum: 1200px width
- Preferred: 1920px+ width
- Maximum: 4000px width (resize to 2400px)

**File Size**:
- Target after compression: 300-500KB
- Maximum before compression: 5MB
- Reject if <50KB (likely low quality)

**Format**:
- Accept: JPG, PNG, WebP
- Convert to: WebP (with JPG fallback)
- Reject: GIF, BMP, TIFF

**Content Quality**:
- Sharp focus (reject blurry images)
- Good lighting (reject over/underexposed)
- Relevant composition (manual review needed)
- No watermarks (prefer unwatermarked)

---

## Error Handling Strategy

### API Errors

**Rate Limit Exceeded**:
- Detect 429 status code
- Wait for retry-after header duration
- Fall back to next source if available
- Log and continue

**API Key Invalid**:
- Detect 401/403 status codes
- Log clear error message
- Skip that source
- Continue with other sources

**Network Errors**:
- Retry up to 3 times with exponential backoff
- Log error details
- Skip image if all retries fail
- Continue with next image

### Download Errors

**Image Download Failed**:
- Retry up to 3 times
- Log URL and error
- Skip and continue

**Image Corrupted**:
- Validate image format
- Skip corrupted images
- Log for manual review

**Upload Failed**:
- Retry upload up to 3 times
- Keep local copy for manual upload
- Log error details

---

## Success Metrics

### Download Performance

**Target**:
- Download 500+ images in first run
- 100+ images per source
- <10% duplicate rate
- <5% failed downloads

**Organization**:
- 90%+ auto-categorization accuracy
- Proper themed area distribution
- Seasonal content well-represented

**Quality**:
- Average image size: 400-600KB
- All images >1200px width
- No corrupted images uploaded

---

## Future Enhancements (Post-MVP)

### Advanced Features
1. **AI-Powered Categorization**: Use vision API to auto-detect themed areas
2. **Smart Search**: Learn from user feedback to improve query selection
3. **Image Similarity Clustering**: Group visually similar images
4. **Automatic Tagging**: Extract tags from image content
5. **Web Scraping**: Ethically scrape Busch Gardens official site (respect robots.txt)
6. **Video Frame Extraction**: Extract high-quality frames from YouTube videos

### Database Integration
1. **Supabase Database**: Store metadata in database tables (not just JSON)
2. **Search Interface**: Build web UI to search downloaded images
3. **User Ratings**: Allow rating images for quality/relevance
4. **Collections**: Group images into themed collections

### Integration
1. **Automatic Updates**: Schedule weekly downloads for new content
2. **Webhook Notifications**: Notify when new images added
3. **Image Gallery**: Display images in Next.js app
4. **Plant Encyclopedia**: Link plant images to care guides

---

## Risk Mitigation

### API Risks

**Risk**: API rate limits too restrictive
**Mitigation**:
- Implement intelligent caching
- Spread downloads over multiple days
- Use multiple sources to diversify

**Risk**: API key costs
**Mitigation**:
- Focus on free tiers first
- Monitor usage closely
- Set hard limits in code

**Risk**: API deprecation
**Mitigation**:
- Use adapter pattern for easy swapping
- Monitor API status pages
- Have fallback sources ready

### Storage Risks

**Risk**: Supabase storage limits
**Mitigation**:
- Monitor storage usage
- Implement image compression
- Archive old/unused images

**Risk**: Duplicate images consuming space
**Mitigation**:
- Strong duplicate detection
- Regular cleanup audits
- Hash-based comparison

### Legal Risks

**Risk**: Copyright issues
**Mitigation**:
- Only use properly licensed sources
- Store attribution metadata
- Respect license terms
- Focus on free/public domain

**Risk**: Terms of service violations
**Mitigation**:
- Read and follow all ToS
- Implement rate limiting
- Use official APIs only
- Respect robots.txt

---

## Testing Plan

### Unit Tests

**Storage Manager**:
- ✅ Test duplicate detection with identical images
- ✅ Test duplicate detection with similar images
- ✅ Test metadata storage and retrieval
- ✅ Test auto-categorization logic

**Image Processor**:
- ✅ Test image optimization (resize, compress)
- ✅ Test image validation (resolution, format)
- ✅ Test EXIF extraction

**Source Adapters**:
- ✅ Test each API client with mock responses
- ✅ Test rate limiting enforcement
- ✅ Test error handling

### Integration Tests

**End-to-End**:
- ✅ Download from Unsplash → Upload to Supabase
- ✅ Download from multiple sources in one run
- ✅ Resume interrupted downloads
- ✅ Handle API failures gracefully

**Performance**:
- ✅ Download 100 images concurrently
- ✅ Verify duplicate detection speed
- ✅ Measure average download time

### Manual Testing

**Quality Assurance**:
- ✅ Verify downloaded images match categories
- ✅ Check auto-categorization accuracy
- ✅ Validate image quality standards met
- ✅ Review attribution metadata

---

## Documentation Deliverables

### README.md Updates

```markdown
## Image Downloader

### Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env.local` and add API keys:
   ```env
   UNSPLASH_ACCESS_KEY=your_key_here
   PEXELS_API_KEY=your_key_here
   PIXABAY_API_KEY=your_key_here
   ```

3. Run the downloader:
   ```bash
   npm run download-images
   ```

### Usage

Download all images from all sources:
```bash
npm run download-images
```

Download from specific source:
```bash
npm run download-images -- --source=unsplash
```

Download specific category:
```bash
npm run download-images -- --category=landscape --limit=50
```

Download by themed area:
```bash
npm run download-images -- --themed-area=germany --limit=30
```

Preview without downloading (dry run):
```bash
npm run download-images -- --dry-run
```

### API Key Setup

See [API-KEYS-SETUP.md](./docs/API-KEYS-SETUP.md) for detailed instructions on obtaining API keys.
```

### API-KEYS-SETUP.md (New File)

Step-by-step guide for:
- Unsplash API key registration
- Pexels API key registration
- Pixabay API key registration
- Trefle API key registration
- Perenual API key registration
- PlantNet API key registration

### TROUBLESHOOTING.md (New File)

Common issues and solutions:
- Rate limit errors
- API key invalid errors
- Network timeout errors
- Duplicate detection issues
- Image quality issues

---

## Conclusion

This plan outlines a comprehensive, intelligent image downloader that will:

1. **Download images** from 5+ sources (Unsplash, Pexels, Pixabay, Wikimedia, Plant DBs)
2. **Organize intelligently** by themed area, category, and season
3. **Avoid duplicates** using hash-based detection
4. **Optimize images** for web use (resize, compress, format conversion)
5. **Store metadata** for searchability and attribution
6. **Provide great UX** with progress tracking, colors, and clear feedback

**Estimated Timeline**: 12 days for full implementation and testing
**Dependencies**: 15 new npm packages
**API Keys Required**: 6 (all free tiers available)
**Expected Output**: 500+ high-quality, organized images in Supabase Storage

---

**Next Steps After Approval**:
1. Create `.env.example` with all required keys
2. Install dependencies (`package.json` updates)
3. Implement Phase 1 (Core Infrastructure)
4. Test with Unsplash integration
5. Iterate through remaining phases

**Questions for User**:
1. Should we prioritize specific themed areas first? (e.g., Germany, Italy)
2. Do you have preferences for image quantity per category?
3. Should we implement the database integration now, or store metadata as JSON files for MVP?
4. Do you want Google Custom Search API integration (requires billing setup)?
