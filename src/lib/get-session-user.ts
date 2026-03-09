import { auth } from "@/auth";

//This helper will allow me to get a userId to be able to test the API.

export async function getSessionUser() {
  // DEV BYPASS — remove before production
  if (process.env.NODE_ENV === "development" && process.env.DEV_USER_ID) {
    return { id: process.env.DEV_USER_ID };
  }

  const session = await auth();
  if (!session?.user?.id) return null;

  return { id: session.user.id };
}
