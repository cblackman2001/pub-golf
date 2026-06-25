"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import { existsSync } from "fs";
import { getUser } from "@/lib/auth";

export async function uploadPhotoAction(formData: FormData) {
  // Security check: Only Admins can upload photos (as requested: "Admins can add/delete these photos.")
  const user = await getUser();
  if (user?.role !== "ADMIN") return { error: "Unauthorized" };

  const pubId = formData.get("pubId")?.toString();
  const file = formData.get("file") as File;

  if (!pubId || !file || file.size === 0) return { error: "Missing file or pub ID" };

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Use custom mount if provided, otherwise fallback to local public folder
  const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), "public", "uploads");
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }

  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "")}`;
  const filepath = path.join(uploadDir, filename);
  await writeFile(filepath, buffer);

  const url = `/api/uploads/${filename}`;

  await prisma.photo.create({
    data: {
      url,
      pubId
    }
  });

  revalidatePath(`/pubs/${pubId}`);
  return { success: true };
}


export async function deletePhotoAction(id: string, pubId: string) {
  const user = await getUser();
  if (user?.role !== "ADMIN") return { error: "Unauthorized" };

  const photo = await prisma.photo.findUnique({ where: { id } });
  if (photo) {
    const filename = photo.url.split("/").pop();
    if (filename) {
      const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), "public", "uploads");
      const filepath = path.join(uploadDir, filename);
      if (existsSync(filepath)) {
        await unlink(filepath).catch(() => {}); // ignore errors if file missing
      }
    }
    await prisma.photo.delete({ where: { id } });
  }
  
  revalidatePath(`/pubs/${pubId}`);
}
