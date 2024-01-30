import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://ocrpjmpoohmqiuomxgrn.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jcnBqbXBvb2htcWl1b214Z3JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY2MzkyMzIsImV4cCI6MjAyMjIxNTIzMn0._SOE1FonJ4AXVbn_tnqHzCR0L1mMQFh9wib0bYbpUhk"; //process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
