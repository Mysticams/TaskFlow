import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://eclmwrugeckrmutueosc.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjbG13cnVnZWNrcm11dHVlb3NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIwOTc0NzUsImV4cCI6MjA5NzY3MzQ3NX0.Uu0YZ_Q4hxJyzfXNAnavTIcKuH0pdmhEFPifhoVrhV8";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
