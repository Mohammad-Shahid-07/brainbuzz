"use client";

import { useEffect, useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import GlobalFilters from "./search/GlobalFilters";
import { globalSearch } from "@/lib/actions/general.action";
const GlobalResult = () => {
  const searchParams = useSearchParams();
  const [isLoaded, setIsLoaded] = useState(false);
  const [result, setResults] = useState([]);
  const global = searchParams.get("global");
  const type = searchParams.get("type");


  
  useEffect(() => {
    const fetchResult = async () => {
      setResults([]);
      setIsLoaded(true);
      try {
        const res = await globalSearch({ query: global, type });
        setResults(JSON.parse(res));
        
      } catch (error) {
        console.log(error);
        throw error;
      } finally {
        setIsLoaded(false);
      }
    };
    if (global) {
        fetchResult();
    }
  }, [global, type]);
  const renderLink = (type: string, slug: string, id: string | undefined, tag: string | undefined, username: string | undefined) => {
    if (type === "question") {
      return `/question/${slug}/${id}`;
    }else if (type === "answer") {
        return `/question/${slug}/${id}`;
     } 
    else if (type === "tag") {
      return `/tag/${tag}`;
    } else {
      return `/profile/${username}`;
    }
  };
  const getTypeIcon = (type: string) => {
    if (type === "question") {
      return "/assets/icons/question.svg";
    } else if (type === "tag") {
      return "/assets/icons/tag.svg";
    }else if (type === "answer") {
        return "/assets/icons/message.svg";
    }
     else {
      return "/assets/icons/avatar.svg";
    }
  }
  return (
    <div className="absolute top-full z-10 mt-3 w-full rounded-xl bg-light-800 py-5 dark:bg-dark-400">
      <p className="text-dark400_light900 paragraph-semibold px-5">
        <GlobalFilters />
      </p>
      <div className="mt-5 h-[1px] bg-light-700/50 dark:bg-dark-500/50" />
      <div className="space-y-5  ">
        <p className="text-dark400_light900 paragraph-semibold px-5">
          Top Match
        </p>
        {isLoaded ? (
          <div className="flex w-full flex-col items-center justify-center px-5">
            <ReloadIcon className="my-2 h-10 w-10 animate-spin text-primary-500" />
            <p className="text-dark200_light800 body-regular">
              Browsing The Entire Database
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {result.length > 0 ? (
              result.map((item : any) => (
                <Link
                href={renderLink(item.type, item.slug, item.id, item.tag, item.username)}
                key={item.type + item.id}
                className="flex w-full items-center gap-3 px-5 py-2 hover:bg-light-700/50 dark:hover:bg-dark-500/50"
              >
                <Image
                  src={getTypeIcon(item.type)} // Assuming you have a function to get the icon based on type
                  alt="search"
                  width={18}
                  height={18}
                  className="invert-colors mt-1 object-contain"
                />
                <div className="flex flex-col">
                  <p className="text-dark200_light800 body-medium line-clamp-1">
                    {item?.title || item?.id || item?.tag || item?.username}
                  </p>
                  <p className="text-dark400_light900 small-medium">
                    {item?.type}
                  </p>
                </div>
              </Link>
              ))
            ) : (
              <div className="flex w-full flex-col items-center justify-center px-5">
                <p className="text-dark200_light800 body-regular">
                  No Results Found
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalResult;
