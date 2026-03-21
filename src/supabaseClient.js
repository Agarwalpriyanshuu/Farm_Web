import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vtrtpbqzycykjmesdcjo.supabase.co'
const supabaseKey = 'sb_publishable_pVS3QkAQjT_GMVBse92rWw_ZrVABOxF'

export const supabase = createClient(supabaseUrl, supabaseKey)