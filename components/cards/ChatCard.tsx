import Image from "next/image";
import Link from "next/link";
import React from "react";

const ChatCard = async () => {
  return (
    <Link
      href={"#"}
      className="shadow-light100_darknone w-full transition-all hover:scale-105 max-xs:min-w-full xs:w-[260px]"
    >
      <article className="background-light900_dark200 light-border flex w-full flex-col items-center justify-center rounded-2xl border p-8">
        <Image
          src="/assets/images/logo.png"
          alt="user profile picture"
          width={100}
          height={100}
          className="rounded-full"
        />

        <div className="mt-4 text-center">
          <h3 className="h3-bold text-dark200_light900 line-clamp-1">
            Have A fight
          </h3>
          <p className="subtle-regular text-dark500_light500 mt-2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui
            corporis architecto repellendus laborum. Expedita consequuntur
            laborum voluptatibus dolores pariatur, saepe, quas minima placeat
            voluptas ullam facilis similique. Aut, sint rerum?
          </p>
        </div>
      </article>
    </Link>
  );
};

export default ChatCard;
