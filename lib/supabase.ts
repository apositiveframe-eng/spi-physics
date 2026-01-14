
import { createClient } from '@supabase/supabase-js';

// Neural Link Credentials
const supabaseUrl = 'https://mckqywarqrehnsylaqqy.supabase.co';
const supabaseAnonKey = 'sb_publishable_8J2Sg5r4870jnr9cPNja-w_wtj1ezHU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
