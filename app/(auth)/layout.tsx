import { Toaster } from "@/components/ui/toaster";
import React from "react";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/session";
import { processEmailForUsername } from "@/lib/utils";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const user  = await currentUser()
  if (user) {
    const username = processEmailForUsername(user.email!);
    if (username !== user.username) {
      redirect("/");
    }
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
