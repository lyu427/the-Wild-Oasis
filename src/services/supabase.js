import { createClient } from "@supabase/supabase-js";
export const supabaseUrl = "https://kqgodlogbowtdpusbtqy.supabase.co";
const supabaseKey = "sb_publishable_MvGi0k6_6YoeIPmiYyGvXQ_XY7HIGhi";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
