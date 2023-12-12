"use client";
import { sidebarLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { signOut, useSession } from "next-auth/react";

const LeftSidebar = () => {
  const { data: session } = useSession();
  console.log(session);
  const username = session?.user?.username;
  let SignedIn;
  if (session) {
    SignedIn = true;
  } else {
    SignedIn = false;
  }
  if (username) {
    sidebarLinks.forEach((link) => {
      if (link.route === "/profile") {
        link.route = `/profile/${username}`;
      }
    });
  }

  const NavContent = () => {
    const path = usePathname();
    return (
      <div className="flex flex-1 flex-col gap-6 pt-16">
        {sidebarLinks.map((link) => {
          const isActive =
            (path.includes(link.route) && link.route.length > 1) ||
            path === link.route;

          return (
            <Link
              key={link.label}
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
              <p
                className={`${
                  isActive ? "base-bold" : "base-medium"
                } max-lg:hidden `}
              >
                {link.label}
              </p>
            </Link>
          );
        })}
      </div>
    );
  };

  return (
    <section className="background-light900_dark200 light-border custom-scrollbar sticky  left-0 top-0 flex h-screen max-w-sm flex-col justify-between   p-6 pt-36 shadow-light-300 dark:shadow-none  max-sm:hidden   sm:pt-12">
      <NavContent />
      {!SignedIn ? (
        <div className="flex flex-col gap-3">
          <Link href="/signin">
            <Button className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
              <span className="primary-text-gradient max-lg:hidden">
                Log In
              </span>
              <Image
                src="/assets/icons/account.svg"
                alt="login"
                width={20}
                height={20}
                className="lg:hidden"
              />
            </Button>
          </Link>

          <Link href="/signup">
            <Button className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
              <span className=" max-lg:hidden">Sign up</span>
              <Image
                src="/assets/icons/signup.svg"
                alt="sign up"
                width={20}
                height={20}
                className="lg:hidden"
              />
            </Button>
          </Link>
        </div>
      ) : (
        <Button
          className="small-medium btn-secondary min-h-[41px] w-full  rounded-lg px-4 py-3 text-light-850 shadow-none transition-transform hover:scale-105"
          onClick={() => signOut()}
        >
          <Image
            src="/assets/icons/logout.svg"
            alt="sign up"
            width={20}
            height={20}
            className="mr-2"
          />
          <span className=" max-lg:hidden  ">Logout</span>
        </Button>
      )}
    </section>
  );
};

export default LeftSidebar;
