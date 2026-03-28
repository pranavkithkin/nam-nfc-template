import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

function getClient() {
  return createClient(supabaseUrl, supabaseAnonKey);
}

/**
 * Upload a base64 data URI to Supabase Storage.
 * Returns the public URL of the uploaded file.
 * Buckets are public. API route is auth-protected at Next.js level.
 */
export async function uploadToSupabase(
  dataUri: string,
  bucket: "avatars" | "covers"
): Promise<string> {
  const supabase = getClient();

  // Strip the data URI prefix: "data:image/jpeg;base64,..."
  const matches = dataUri.match(/^data:([a-zA-Z0-9+/]+\/[a-zA-Z0-9+/]+);base64,(.+)$/);
  if (!matches) throw new Error("Invalid data URI format");

  const mimeType = matches[1];
  const base64Data = matches[2];
  const extension = mimeType.split("/")[1].replace("jpeg", "jpg");

  // Unique filename
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;
  const buffer = Buffer.from(base64Data, "base64");

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filename, buffer, {
      contentType: mimeType,
      upsert: false,
    });

  if (error) throw new Error(`Storage upload failed: ${error.message}`);

  const { data } = supabase.storage.from(bucket).getPublicUrl(filename);
  return data.publicUrl;
}
