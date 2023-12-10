"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { signOut } from "next-auth/react";

import Image from "next/image";
import Link from "next/link";

const ProfileMenu = ({ user }: { user: string }) => {
  const mongoUser = JSON.parse(user);
  return (
    <Popover>
      <PopoverTrigger>
        <Image
          src={mongoUser.image}
          alt="profile"
          height={40}
          width={40}
          className="h-9 w-9 cursor-pointer rounded-full"
        />
      </PopoverTrigger>
      <PopoverContent className="background-light700_dark400 mr-10   border-none p-5 shadow-light-200 max-md:min-w-[350px]">
        <div>
          <div className="text-dark500_light500 flex items-center gap-3">
            <Image
              src={mongoUser.image}
              alt="profile"
              height={40}
              width={40}
              className="h-9 w-9  cursor-pointer rounded-full  "
            />
            <div>
              <p className="body-semibold text-dark200_light900">
                {mongoUser.username}
              </p>
              <p className="subtle-regular text-light400_light500">
                {mongoUser.name}
              </p>
            </div>
          </div>
          <div className="text-dark500_light700 mt-5  ">
            <Link
              href="/profile/edit"
              className="flex items-start gap-5   py-3  text-sm"
            >
              <Image
                src="/assets/icons/user.svg"
                className="dark:invert-0"
                alt="user icon"
                width={20}
                height={20}
              />
              <span>Manage Account</span>
            </Link>

            <button
              className="inline-flex  items-center gap-5  py-3 text-sm "
              onClick={() => signOut()}
            >
              <Image
                src="/assets/icons/logout.svg"
                className="dark:invert-0"
                alt="Logout"
                width={20}
                height={20}
              />

              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ProfileMenu;
