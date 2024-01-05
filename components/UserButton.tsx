"use client";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";

import { signOut } from "next-auth/react";

import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

const UserButton = ({ user }: { user: string }) => {
  const mongoUser = JSON.parse(user);
  return (
    <Menubar className="relative border-none bg-transparent shadow-none">
      <MenubarMenu>
        <MenubarTrigger className="focus:bg-light-900 !bg-transparent data-[state-opne]:bg-light-900 dark:focus:bg-dark-200 dark:data-[state-open]:bg-dark-200">
          <Image
            src={mongoUser?.image || "/user.jpg"}
            alt="profile"
            height={40}
            width={40}
            className="h-9 w-9  cursor-pointer rounded-full "
          />
        </MenubarTrigger>
        <MenubarContent className="background-light700_dark400 mr-10   min-w-[350px] border-none p-5 shadow-light-200">
          <MenubarItem>
            <div className="text-dark500_light500 flex items-center gap-3 dark:hover:bg-dark-400">
              <Image
                src={mongoUser.image || "/user.jpg"}
                alt="profile"
                height={40}
                width={40}
                className="h-9 w-9  cursor-pointer rounded-full "
              />
              <div>
                <p className="body-semibold text-dark200_light900">
                  {mongoUser?.username}
                </p>
                <p className="subtle-regular text-light400_light500">
                  {mongoUser?.name}
                </p>
              </div>
            </div>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem className="text-dark500_light700 focus:bg-light-400/5 ">
            <Link
              href="/profile/edit"
              className="flex items-start gap-5  w-full  py-3  text-sm"
            >
              <Image
                src={mongoUser?.image || "/user.jpg"}
                className=""
                alt="user icon"
                width={20}
                height={20}
              />
              <span>Manage Account</span>
            </Link>
          </MenubarItem>
          <MenubarItem className="text-dark500_light700 focus:bg-light-400/5 ">
            <Button
              className="mr-auto w-full gap-5  py-3 text-sm "
              onClick={() => signOut()}
              variant="ghost"
            >
              <Image
                src="/logout.svg"
                className="invert dark:invert-0"
                alt="Logout"
                width={20}
                height={20}
              />
              <span>Sign Out</span>
            </Button>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};

export default UserButton;
