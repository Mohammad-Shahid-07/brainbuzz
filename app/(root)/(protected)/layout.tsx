import { currentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import React from "react";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const sessionUser = await currentUser();
  if (!sessionUser) redirect("/login");
  return <div className="mx-auto w-full max-w-5xl">{children}</div>;
};

export default Layout;
