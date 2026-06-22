import { createClient } from "@supabase/supbase-js";

const SUPABASE_URL = "https://eclmwrugeckrmutueosc.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_IOJVPt3RgdK7Q9rXxhPraA_vRjDUN3H";
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
