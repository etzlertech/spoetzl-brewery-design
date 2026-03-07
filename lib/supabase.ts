import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://armklbqsjcmrhqljmacz.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFybWtsYnFzamNtcmhxbGptYWN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5MjIxMDMsImV4cCI6MjA4ODQ5ODEwM30.0Lco8yeUN6PdQxHbcxP3N1JKrGAI2lOA04Pzrqt7v40'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
