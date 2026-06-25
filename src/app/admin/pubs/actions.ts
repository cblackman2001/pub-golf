"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createPubAction(formData: FormData) {
  const name = formData.get("name")?.toString() || "";
  const description = formData.get("description")?.toString() || "";
  const challenge = formData.get("challenge")?.toString() || "";
  const order = parseInt(formData.get("order")?.toString() || "1", 10);
  const latStr = formData.get("lat")?.toString() || "";
  const lngStr = formData.get("lng")?.toString() || "";

  if (!name) return { error: "Name is required" };

  await prisma.pub.create({
    data: {
      name,
      description,
      challenge,
      order,
      lat: parseFloat(latStr) || 51.505,
      lng: parseFloat(lngStr) || -0.09,
    }
  });

  revalidatePath("/admin/pubs");
  revalidatePath("/pubs");
  return { success: true };
}

export async function deletePubAction(id: string) {
  await prisma.photo.deleteMany({ where: { pubId: id } });
  await prisma.score.deleteMany({ where: { pubId: id } });
  await prisma.pub.delete({ where: { id } });

  revalidatePath("/admin/pubs");
  revalidatePath("/pubs");
}
