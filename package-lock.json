"use server";

import prisma from "@/lib/prisma";
import { createSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function loginAction(prevState: unknown, formData: FormData) {
  const pin = formData.get("pin")?.toString().trim();

  if (!pin || pin.length !== 4) {
    return { error: "PIN must be exactly 4 digits." };
  }

  // Find user by PIN
  const user = await prisma.user.findUnique({
    where: { pin },
  });

  if (!user) {
    return { error: "Invalid PIN. User not found." };
  }

  // Create session
  await createSession(user.id, user.role);

  // Redirect based on role
  if (user.role === "ADMIN") {
    redirect("/admin");
  } else {
    redirect("/pubs");
  }
}
