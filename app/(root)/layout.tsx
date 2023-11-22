import Navbar from "@/components/shared/navbar/Navbar";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="background-light850_dark100 relative">
      <Navbar />
      <div className="flex">
        Leftsidebar
        <section className="mt-36 flex min-h-screen flex-1 flex-col px-6 pb-6 max-md:pb-14 sm:px-14 ">
            <div className="mx-auto w-full max-w-5xl">
                {children}
            </div>
        </section>
        RideSideBar
      </div>
      Tostar
    </main>
  );
};

export default Layout;
