# Set SUPABASE_SERVICE_ROLE_KEY in the shell before running this helper.
# Service-role keys must never be committed to source control.
if (-not $env:SUPABASE_SERVICE_ROLE_KEY) {
    Write-Error "Missing SUPABASE_SERVICE_ROLE_KEY. Set it in your shell or use run-upload.ps1 with a clipboard key."
    exit 1
}

# Navigate to directory and run upload script
Set-Location "C:\Users\TravisEtzler\Documents\GitHub\Spoetzl Brewery Landscape Design system\spoetzl-brewery-app"
node scripts/upload-images-to-supabase.mjs
