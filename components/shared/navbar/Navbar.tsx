import Image from "next/image";
import Link from "next/link";
import React from "react";
import Theme from "./Theme";
import MobileNav from "./MobileNav";
import GlobalSearch from "../search/GlobalSearch";
import { getUserById } from "@/lib/actions/user.action";
import ProfileMenu from "../ProfileMenu";
import { currentUser } from "@/lib/session";
const Navbar = async () => {
  const sessionUser = await currentUser();

  const mongoUser = await getUserById();

  return (
    <nav className="flex-between background-light900_dark200 fixed z-50 w-full gap-5 p-6 shadow-light-300 dark:shadow-none sm:px-12 ">
      <Link href="/" className="flex items-center gap-1">
        <Image
          src="/assets/images/site-logo.svg"
          width={23}
          height={23}
          alt="site logo"
        />
        <p className="h2-bold font-spaceGrotesk text-dark-100 dark:text-light-900 max-sm:hidden">
          Brain <span className="text-primary-500">Buzz</span>{" "}
        </p>
      </Link>
      <GlobalSearch />
      <div className="flex-between gap-5">
        <Theme />

        {sessionUser && <ProfileMenu user={JSON.stringify(mongoUser)} />}
        <MobileNav SignedIn={!!sessionUser} />
      </div>
    </nav>
  );
};

export default Navbar;
