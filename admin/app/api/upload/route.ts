import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadToSupabase } from "@/lib/supabaseStorage";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { dataUri, folder } = await req.json();
    if (!dataUri) {
      return NextResponse.json({ error: "No image data provided" }, { status: 400 });
    }

    // Map folder name to bucket: "avatars" or "covers"
    const bucket = folder === "covers" ? "covers" : "avatars";
    const url = await uploadToSupabase(dataUri, bucket);
    return NextResponse.json({ url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed. Check Supabase Storage." }, { status: 500 });
  }
}
