import Image from "next/image";
import { Button } from "../ui/button";
import Votes from "../shared/Votes";
import Comment from "../forms/Comment";
import ReplyButton from "../shared/ReplyButton";

interface Props {
  userId: string;
  id: string;
author: {
    _id: string;
    name: string;
    picture: string;
    username: string;
    clerkId: string;
  };
  content: string;
  createdAt: string;
  upvotes: string[];
  downvotes: string[];
  replies: number;
  mongoUser: any
  blogId: string;

}

const CommentCard = async({
  userId,
  id,
  author,
  content,
  createdAt,
  upvotes,
  downvotes,
  blogId,
  replies,
  mongoUser
}: Props) => {


  return (
    <div className="mt-5">
      <div className="flex items-start gap-2 ">
        <Image
          src={author.picture}
          alt="profile-picture"
          width={40}
          height={40}
          className="rounded-full object-cover"
        />

        <div className="flex flex-col ">
          <h2 className="h3-bold text-dark100_light900">{author.name}</h2>
          <p className="paragraph-regular text-dark200_light800">@UserName</p>

          <div className=" flex flex-col ">
            <p className="text-dark200_light800 line-clamp-3">
             {content}
            </p>
            <div className="flex justify-end">
            <Votes
              type="Comment"
              upvotes={upvotes?.length}
              hasUpvoted={upvotes?.includes(mongoUser?._id)}
              downvotes={downvotes?.length}
              hasDownvoted={downvotes.includes(mongoUser?._id)}
              itemId={JSON.stringify(id)}
              userId={JSON.stringify(mongoUser?._id)}
            />
            </div>
             <ReplyButton
              itemId={JSON.stringify(id)}
              userId={JSON.stringify(mongoUser?._id)}
              blogId={JSON.stringify(blogId)}
              />
          </div>
        </div>
      </div>
      <div className="mt-5 h-[1px] bg-light-700/50 dark:bg-dark-500/50" />
    </div>
  );
};

export default CommentCard;
