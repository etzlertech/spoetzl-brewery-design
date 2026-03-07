# Get API key from clipboard
$apiKey = Get-Clipboard

# Set environment variable
$env:SUPABASE_ANON_KEY = $apiKey

# Navigate to directory and run upload script
Set-Location "C:\Users\TravisEtzler\Documents\GitHub\Spoetzl Brewery Landscape Design system\spoetzl-brewery-app"
node scripts/upload-images-to-supabase.mjs
