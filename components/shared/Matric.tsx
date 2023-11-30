import Image from "next/image";
import Link from "next/link";
import React from "react";
interface Props {
  imgURL: string;
  alt: string;
  value: number | string;
  title: string;
  href?: string;
  textStyles?: string;
  isauthor?: boolean;
  height?: number;
  width?: number;
}
const Matric = ({
  imgURL,
  alt,
  value,
  title,
  href,
  textStyles,
  isauthor,
  height,
  width,
}: Props) => {
  const matricContent = (
    <>
      <Image
        src={imgURL}
        alt={alt}
        width={`${width || "16"}`}
        height={`${height || "16"}`}
        className={`object-contain ${href ? "rounded-full" : ""}`}
      />
      <p className={`${textStyles} flex items-center gap-1 `}>
        {value}
        <span className={` line-clamp-1 ${isauthor ? "max-sm:hidden" : ""}`}>
          {title}
        </span>
      </p>
    </>
  );
  if (href) {
    return (
      <Link href={href} className="flex-center gap-1">
        {matricContent}
      </Link>
    );
  }
  return <div className="flex-center flex-wrap gap-1">{matricContent}</div>;
};

export default Matric;
