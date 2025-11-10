import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://lhcorivudazczbwyehty.supabase.co";
const supabaseKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxoY29yaXZ1ZGF6Y3pid3llaHR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3ODMxNjksImV4cCI6MjA3ODM1OTE2OX0.0ZEs4XdKRxN2xtwZ8PAUhe0z6zTehav5dcrzs8lvEBY";

export const supabase = createClient(supabaseUrl, supabaseKey);
