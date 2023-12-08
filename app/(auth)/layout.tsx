import { Toaster } from "@/components/ui/toaster";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
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
