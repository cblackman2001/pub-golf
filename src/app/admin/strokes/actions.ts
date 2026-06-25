"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitStrokeAction(formData: FormData) {
  const pubId = formData.get("pubId")?.toString();
  const userId = formData.get("userId")?.toString();
  const strokesStr = formData.get("strokes")?.toString();

  if (pubId && userId && strokesStr) {
    const strokes = Number(strokesStr);

    if (!Number.isInteger(strokes) || strokes < 0) {
      return;
    }
    
    await prisma.score.upsert({
      where: {
        pubId_userId: {
          pubId,
          userId
        }
      },
      update: { strokes },
      create: { pubId, userId, strokes }
    });

    revalidatePath("/admin/strokes");
    revalidatePath("/leaderboard");
    revalidatePath(`/pubs/${pubId}`);
  }
}
