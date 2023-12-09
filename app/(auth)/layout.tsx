import { Toaster } from "@/components/ui/toaster";
import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(authOptions);
  const user = session?.user || null;
  if (user) {
    redirect("/");
  }
  return (
    <main className="relative bg-auth-dark bg-cover bg-center  bg-no-repeat">
      <section className="flex min-h-screen flex-col items-center justify-center px-6 pb-6 max-md:pb-14 sm:px-14 ">
        <div className="mx-auto w-full max-w-5xl">{children}</div>
      </section>

      <Toaster />
    </main>
  );
};

export default Layout;
