import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

export async function GET(request: NextRequest, { params }: { params: Promise<{ filename: string }> }) {
  const resolvedParams = await params;
  
  // Use custom mount if provided, otherwise fallback to local public folder
  const uploadDir = process.env.UPLOAD_PATH || path.join(process.cwd(), "public", "uploads");
  const filePath = path.join(uploadDir, resolvedParams.filename);
  
  if (!existsSync(filePath)) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const file = await readFile(filePath);
  
  const ext = path.extname(resolvedParams.filename).toLowerCase();
  let contentType = "image/jpeg";
  if (ext === ".png") contentType = "image/png";
  if (ext === ".webp") contentType = "image/webp";
  if (ext === ".gif") contentType = "image/gif";
  if (ext === ".svg") contentType = "image/svg+xml";

  return new NextResponse(file, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable"
    }
  });
}
