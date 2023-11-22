"use client";
import { Input } from "@/components/ui/input";
import Image from "next/image";

interface Props {
  route: string;
  iconPosition: string;
  imgSrc: string;
  placeholder: string;
  otherClasses?: string;
}
const LocalSearchbar = ({
  route,
  iconPosition,
  imgSrc,
  placeholder,
  otherClasses,
}: Props) => {
  return (
    <div
      className={`background-light800_darkgradient flex grow gap-4 rounded px-4 ${otherClasses}`}
    >
      {iconPosition === "left" && (
        <Image
          src={imgSrc}
          alt="search Icon"
          height={24}
          width={24}
          className="cursor-pointer"
        />
      )}
      <Input
        placeholder={placeholder}
        value=""
        className="text-dark100_light900 paragraph-regular no-focus  border-none bg-transparent font-spaceGrotesk shadow-none outline-none"
      />
       {iconPosition === "right" && (
        <Image
          src={imgSrc}
          alt="search Icon"
          height={24}
          width={24}
          className="cursor-pointer"
        />
      )}
    </div>
  );
};

export default LocalSearchbar;
