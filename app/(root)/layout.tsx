import LeftSidebar from "@/components/shared/LeftSidebar";
import RightSidebar from "@/components/shared/RightSidebar";
import Navbar from "@/components/shared/navbar/Navbar";
import { Toaster } from "@/components/ui/toaster";
import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

  const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(authOptions);

  let SignedIn;
  if (session) {
    SignedIn = true;
  } else {
    SignedIn = false;
  }
  return (
    <main className="background-light850_dark100 relative">
      <Navbar />
      <div className="flex">
        <LeftSidebar SignedIn={SignedIn} username={session?.user?.username} />
        <section className="mt-36 flex min-h-screen flex-1 flex-col px-6 pb-6 max-md:pb-14 sm:px-14 ">
            <div className="mx-auto w-full max-w-5xl">
                {children}
            </div>
        </section>
        <RightSidebar />
      </div>
      <Toaster />
    </main>
  );
};

export default Layout;
