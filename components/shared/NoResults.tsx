import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";

interface Props {
    title: string;
    discription: string;
    link: string;
    linkText: string;
    }
const NoResults = ({title, discription, link, linkText} : Props) => {
  return (
    <div className="mt-10 flex w-full flex-col items-center justify-center">
      <Image
        src="/assets/images/light-illustration.png"
        width={300}
        height={300}
        alt="No Results"
        className="block object-contain dark:hidden"
      />
      <Image
        src="/assets/images/dark-illustration.png"
        width={300}
        height={300}
        alt="No Results"
        className="hidden object-contain dark:flex"
      />
      <h2 className="h2-bold text-dark200_light900 mt-8  ">
        {title}
      </h2>
      <p className="body-regular text-dark500_light700 my-3.5 max-w-md text-center">
       {discription}
      </p>
      <Link href={link}>
        <Button className="paragraph-medium mt-5 min-h-[46px] rounded-lg bg-primary-500 px-4 py-3 text-light-900 hover:bg-primary-100 dark:bg-primary-500 dark:text-light-900 ">
         {linkText}
        </Button>
      </Link>
    </div>
  );
};

export default NoResults;
