"use client";
import { Input } from "@/components/ui/input";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, {  useEffect, useRef, useState } from "react";
import GlobalResult from "../GlobalResult";

const GlobalSearch = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchConatinerRef = useRef(null);
  const query = searchParams.get("q");
  const [search, setSearch] = useState(query || "");
  const [isOpen, setIsOpen] = useState(false);
   
  useEffect(() => {
    const handleOutSideClick = (e: any) => {
      if (searchConatinerRef.current && 
        // @ts-ignore
        !searchConatinerRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearch("");
      }
    }
  setIsOpen(false);
  document.addEventListener("click", handleOutSideClick);
  return () => document.removeEventListener("click", handleOutSideClick);
  }
  ,[])
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "global",
          value: search,
        });
        router.push(newUrl, { scroll: false });
      } else {
        if (query) {  
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keysToRemove: ["global" , "type"],
          });
          router.push(newUrl, { scroll: false });
        }
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [query, search, pathname, router, searchParams]);

  return (
    <div className="relative w-full max-w-[600px] max-lg:hidden" ref={searchConatinerRef}>
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
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            if (e.target.value === "" && isOpen) setIsOpen(false);

            if (!isOpen) setIsOpen(true);
          }}
          className="text-dark100_light900 paragraph-regular no-focus  border-none bg-transparent font-spaceGrotesk shadow-none outline-none"
        />
      </div>
      {isOpen && (
        <GlobalResult
         />
        )}
    </div>
  );
};

export default GlobalSearch;
