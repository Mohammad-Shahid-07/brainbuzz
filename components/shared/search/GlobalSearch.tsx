import { Input } from "@/components/ui/input";
import Image from "next/image";
import React from "react";

const GlobalSearch = () => {
  return (
    <div className="relative w-full max-w-[600px] max-lg:hidden ">
      <div className="background-light800_darkgradient relative flex min-h-[56px] grow items-center gap-1 rounded-xl px-4 ">
        <Image
          src="/assets/icons/search.svg"
          alt="search"
          height={24}
          width={24}
          className="cursor-pointer"
        />
        <Input
          placeholder="Search..."
          
          className="text-dark100_light900 paragraph-regular no-focus  border-none bg-transparent font-spaceGrotesk shadow-none outline-none"
        />
      </div>
    </div>
  );
};

export default GlobalSearch;
