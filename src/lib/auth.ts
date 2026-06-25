import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import prisma from "./prisma";

const SECRET_KEY = process.env.JWT_SECRET || "default_secret_key_for_dev_pub_golf_2026";
const key = new TextEncoder().encode(SECRET_KEY);

export async function createSession(userId: string, role: string) {
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 1 week
  const session = await new SignJWT({ userId, role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);

  const cookieStore = await cookies();
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expires,
    sameSite: "lax",
    path: "/",
  });
}

export async function verifySession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) return null;

  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: ["HS256"],
    });
    return payload as { userId: string; role: string };
  } catch (error) {
    return null;
  }
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.set("session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
    path: "/",
  });
}

export async function getUser() {
  const session = await verifySession();
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  });
  return user;
}
