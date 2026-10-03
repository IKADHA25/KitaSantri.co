import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Membuat instance Supabase Client yang bisa digunakan di seluruh aplikasi
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
