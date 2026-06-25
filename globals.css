"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createTeamAction(formData: FormData) {
  const name = formData.get("name")?.toString();
  if (name) {
    await prisma.team.create({ data: { name } });
    revalidatePath("/admin/players");
    revalidatePath("/leaderboard");
  }
}

export async function deleteTeamAction(id: string) {
  // Unassign users first
  await prisma.user.updateMany({
    where: { teamId: id },
    data: { teamId: null }
  });
  await prisma.team.delete({ where: { id } });
  revalidatePath("/admin/players");
}

export async function createPlayerAction(formData: FormData) {
  const name = formData.get("name")?.toString();
  const pin = formData.get("pin")?.toString();
  const teamId = formData.get("teamId")?.toString();
  const role = formData.get("role")?.toString() || "PLAYER";

  if (name && pin && pin.length === 4) {
    await prisma.user.create({
      data: {
        name,
        pin,
        role,
        ...(teamId ? { teamId } : {})
      }
    });
    revalidatePath("/admin/players");
  }
}

export async function deletePlayerAction(id: string) {
  await prisma.score.deleteMany({ where: { userId: id } });
  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin/players");
}

export async function updatePlayerTeamAction(formData: FormData) {
  const userId = formData.get("userId")?.toString();
  const teamId = formData.get("teamId")?.toString();

  if (userId) {
    await prisma.user.update({
      where: { id: userId },
      data: { teamId: teamId || null }
    });
    revalidatePath("/admin/players");
  }
}
