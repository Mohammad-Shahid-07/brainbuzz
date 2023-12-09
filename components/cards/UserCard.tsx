
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  user: {
    username: string;
    name: string;
    image: string;
    _id: string;
  };
}
const UserCard = async ({ user }: Props) => {
  

  return (
    <Link
    href={`/profile/${user.username}`}
    className="shadow-light100_darknone w-full max-xs:min-w-full xs:w-[260px]"
  >
    <article className="background-light900_dark200 light-border flex w-full flex-col items-center justify-center rounded-2xl border p-8">
      <Image
        src={user?.image}
        alt="user profile picture"
        width={100}
        height={100}
        className="rounded-full  object-cover h-24 w-24"
      />

      <div className="mt-4 text-center">
        <h3 className="h3-bold text-dark200_light900 line-clamp-1">
          {user.name}
        </h3>
        <p className="body-regular text-dark500_light500 mt-2">
          @{user.username}
        </p>
     
      </div>
    </article>
  </Link>
  );
};

export default UserCard;
