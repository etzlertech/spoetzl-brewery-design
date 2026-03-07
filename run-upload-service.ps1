# Use service_role key to bypass RLS policies
$env:SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFybWtsYnFzamNtcmhxbGptYWN6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjkyMjEwMywiZXhwIjoyMDg4NDk4MTAzfQ.RpZROy8PtrDK0XdzBlCLid7jMCsnhvQj8_aHPfuN_SE"

# Navigate to directory and run upload script
Set-Location "C:\Users\TravisEtzler\Documents\GitHub\Spoetzl Brewery Landscape Design system\spoetzl-brewery-app"
node scripts/upload-images-to-supabase.mjs
