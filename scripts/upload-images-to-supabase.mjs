import { createClient } from '@supabase/supabase-js'
import { readFileSync, readdirSync } from 'fs'
import { join, basename } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables from .env file
dotenv.config({ path: join(__dirname, '..', '.env') })

// Supabase configuration
const supabaseUrl = 'https://armklbqsjcmrhqljmacz.supabase.co'
// Use service role key to bypass RLS for uploads
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFybWtsYnFzamNtcmhxbGptYWN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5MjIxMDMsImV4cCI6MjA4ODQ5ODEwM30.0Lco8yeUN6PdQxHbcxP3N1JKrGAI2lOA04Pzrqt7v40'

const supabase = createClient(supabaseUrl, supabaseKey)

// Path to images - go up to parent directory of spoetzl-brewery-app
const imagesDir = join(__dirname, '..', '..', 'Busch-Gardens-Williamsburg-Research', 'images')

async function uploadImages() {
  try {
    console.log('Starting image upload to Supabase...')
    console.log(`Reading images from: ${imagesDir}\n`)

    const files = readdirSync(imagesDir).filter(file =>
      file.match(/\.(jpg|jpeg|png|gif|webp)$/i)
    )

    console.log(`Found ${files.length} images to upload\n`)

    let uploaded = 0
    let failed = 0

    for (const file of files) {
      const filePath = join(imagesDir, file)
      const fileBuffer = readFileSync(filePath)

      // Upload to inspiration folder in images bucket
      const storagePath = `inspiration/${file}`

      console.log(`Uploading: ${file}...`)

      const { data, error } = await supabase.storage
        .from('images')
        .upload(storagePath, fileBuffer, {
          contentType: `image/${file.split('.').pop()}`,
          upsert: true // Overwrite if exists
        })

      if (error) {
        console.error(`  ❌ Failed: ${error.message}`)
        failed++
      } else {
        console.log(`  ✓ Success: ${data.path}`)

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(storagePath)

        console.log(`  📍 URL: ${publicUrl}`)
        uploaded++
      }

      console.log('')
    }

    console.log('═'.repeat(60))
    console.log(`Upload complete!`)
    console.log(`✓ Uploaded: ${uploaded}`)
    console.log(`✗ Failed: ${failed}`)
    console.log(`Total: ${files.length}`)
    console.log('═'.repeat(60))

  } catch (error) {
    console.error('Error uploading images:', error)
    process.exit(1)
  }
}

uploadImages()
