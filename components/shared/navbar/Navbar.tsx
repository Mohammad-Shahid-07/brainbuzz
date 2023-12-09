import Image from "next/image";
import Link from "next/link";
import React from "react";
import Theme from "./Theme";
import MobileNav from "./MobileNav";
import GlobalSearch from "../search/GlobalSearch";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
const Navbar = async () => {
  const session = await getServerSession(authOptions);

  let SignedIn;
  if (session) {
    SignedIn = true;
  } else {
    SignedIn = false;
  }

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

        <MobileNav  SignedIn={SignedIn} />
      </div>
      {SignedIn && (

          <Image
            src={session?.user?.image!}
            alt="sign up"
            width={30}
            height={30}
            className="rounded-full"
          />

      )}
   
    </nav>
  );
};

export default Navbar;
