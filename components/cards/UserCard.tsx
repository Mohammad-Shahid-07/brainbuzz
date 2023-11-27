import { getTopInteractedTags } from "@/lib/actions/tag.actions";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Badge } from "../ui/badge";
import RenderTags from "../shared/RenderTags";

interface Props {
  user: {
    username: string;
    name: string;
    picture: string;
    clerkId: string;
    _id: string;
  };
}
const UserCard = async ({ user }: Props) => {
  const interactedTags = await getTopInteractedTags({ userId: user._id });

  return (
    <Link
      href={`/profile/${user.username}`}
      className="shadow-light100_darknone w-full max-sm:min-w-full xs:w-[260px]"
    >
      <article className="background-light900_dark200 light-border flex w-full flex-col items-center justify-center rounded-xl border p-8">
        <Image
          src={user.picture}
          alt="user profile"
          width={100}
          height={100}
          className="rounded-full"
        />
        <div className="mt-4 text-center">
          <h3 className="h3-bold text-dark200_light900 line-clamp-1">
           {user.name}
          </h3>
          <p className="body-regular text-dark500_light500 mt-2">
            @{user.username}
          </p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {interactedTags.length > 0 ? (
            <div className="flex items-center gap-2">
              {interactedTags.map((tag) => (
               <RenderTags 
               key={tag.name}
               name={tag.name}
               id={tag.name}
               />
              ))}
            </div>
          ) : (
            <Badge>no tags yet</Badge>
          )}
        </div>
      </article>
    </Link>
  );
};

export default UserCard;
