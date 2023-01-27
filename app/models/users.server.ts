import { prisma } from "~/db.server";

import { logout, getUserId } from "~/session.server";

export type { User } from "@prisma/client";

export async function getAllUsers(request: Request) {
  const userId = await getUserId(request);
  if (userId === undefined) return null;

  const users = await prisma.user.findMany();
  if (users) return users;

  throw await logout(request);
}
