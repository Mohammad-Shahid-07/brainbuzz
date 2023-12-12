import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Session, getServerSession } from "next-auth";

let initialized = false;

export let userSession: Session | null;

async function initSession() {
  if (initialized) return;

  await new Promise((resolve) => setTimeout(resolve, 200));

  const session = await getServerSession(authOptions);
  userSession = session;

  initialized = true;
}

initSession();
