import { createClient } from '@supabase/supabase-js'
import { readFileSync, readdirSync } from 'fs'
import { join, basename } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Supabase configuration
const supabaseUrl = 'https://armklbqsjcmrhqljmacz.supabase.co'
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || ''

if (!supabaseAnonKey) {
  console.error('Error: SUPABASE_ANON_KEY environment variable is required')
  console.log('Usage: SUPABASE_ANON_KEY=your-key node scripts/upload-images-to-supabase.mjs')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Path to images
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
