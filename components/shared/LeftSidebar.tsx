"use client";
import { sidebarLinks } from "@/constants";
import { SignedOut, useAuth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { getUserByClerkId } from "@/lib/actions/user.action";

const LeftSidebar = () => {
  const { userId } = useAuth();
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await getUserByClerkId(userId);
        if (user) {
          setUsername(user);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      getUser();
    }
  }, [userId]);
  useEffect(() => {
    if (!isLoading && username) {
      sidebarLinks.forEach((link) => {
        if (link.route === "/profile") {
          link.route = `/profile/${username}`;
        }
      });
    }
  }, [username, isLoading]);
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
      <SignedOut>
        <div className="flex flex-col gap-3">
          <Link href="/sign-in">
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

          <Link href="/sign-up">
            <Button className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
              <span className=" max-lg:hidden">Sign up</span>
              <Image
                src="/assets/icons/sign-up.svg"
                alt="sign up"
                width={20}
                height={20}
                className="lg:hidden"
              />
            </Button>
          </Link>
        </div>
      </SignedOut>
    </section>
  );
};

export default LeftSidebar;
