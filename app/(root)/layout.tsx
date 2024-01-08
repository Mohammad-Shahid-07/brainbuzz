import LeftSidebar from "@/components/shared/LeftSidebar";
import RightSidebar from "@/components/shared/RightSidebar";
import Navbar from "@/components/shared/navbar/Navbar";
import { Toaster } from "@/components/ui/toaster";
import { currentUser } from "@/lib/session";
import React from "react";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const sessionUser = await currentUser();

  return (
    <main className="background-light850_dark100 relative">
      <Navbar />
      <div className="flex">
        <LeftSidebar SignedIn={!!sessionUser} username={sessionUser?.username} />
        <section className="mt-36 flex min-h-screen flex-1 flex-col px-6 pb-6 max-md:pb-14 sm:px-14 ">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </section>
        <RightSidebar />
      </div>
      <Toaster />
    </main>
  );
};

export default Layout;
