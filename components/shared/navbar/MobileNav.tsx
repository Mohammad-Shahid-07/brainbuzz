"use client";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import Link from "next/link";

import { SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { sidebarLinks } from "@/constants";
import { usePathname } from "next/navigation";
const NavContent = () => {
  const path = usePathname();
  return (
    <section className="flex h-full w-full flex-col gap-6 pt-16">
      {sidebarLinks.map((link) => {
        const isActive =
          (path.includes(link.route) && link.route.length > 1) ||
          path === link.route;
        return (
          <SheetClose asChild key={link.label}>
            <Link
              href={link.route}
              className={`${
                isActive
                  ? "primary-gradient  text-white"
                  : "text-dark300_light900"
              }  flex items-center justify-start gap-4 rounded-lg  bg-transparent  p-3  shadow-none`}
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={23}
                height={23}
                className={`${isActive ? "" : "invert-colors"} `}
              />
              <p className=" text-dark100_light900 font-spaceGrotesk ">
                {link.label}
              </p>
            </Link>
          </SheetClose>
        );
      })}
    </section>
  );
};
const MobileNav = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Image
          src="/assets/icons/hamburger.svg"
          alt="mobile nav"
          height={36}
          width={36}
          className="invert-colors sm:hidden"
        />
      </SheetTrigger>
      <SheetContent
        side="left"
        className="background-light900_dark200 border-none "
      >
        <Link href="/" className="flex items-center gap-1">
          <Image
            src="/assets/images/site-logo.svg"
            width={23}
            height={23}
            alt="site logo"
          />
          <p className="h2-bold text-dark100_light900 font-spaceGrotesk ">
            StackWith <span className="text-primary-500">Next</span>{" "}
          </p>
        </Link>
        <div className="flex  min-h-full flex-col justify-between">
          <SheetClose asChild>
            <NavContent />
          </SheetClose>
          <SignedOut>
            <div className="mb-5 flex flex-col gap-3">
              <SheetClose asChild>
                <Link href="/sign-in">
                  <Button className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
                    <span className="primary-text-gradient">Log In</span>
                  </Button>
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/sign-up">
                  <Button className="small-medium btn-tertiary light-border-2 min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
                    <span className="primary-text-gradient">Sign Up</span>
                  </Button>
                </Link>
              </SheetClose>
            </div>
          </SignedOut>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
