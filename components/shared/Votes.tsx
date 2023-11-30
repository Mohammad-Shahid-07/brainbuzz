"use client";
import { downvoteAnswer, upvoteAnswer } from "@/lib/actions/answer.action";
import { viewBlog, viewQuestion } from "@/lib/actions/interaction.action";
import {
  downvoteQuestion,
  toggleSaveQuestion,
  upvoteQuestion,
} from "@/lib/actions/question.action";
import { formatLargeNumber } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "../ui/use-toast";
import { downvoteBlog, toggleSaveBlog, upvoteBlog } from "@/lib/actions/blog.action";

interface Props {
  type: string;
  upvotes: number;
  hasUpvoted: boolean;
  downvotes: number;
  hasDownvoted: boolean;
  hasSaved?: boolean;
  itemId: string;
  userId: string;
}
const Votes = ({
  type,
  upvotes,
  hasUpvoted,
  downvotes,
  hasDownvoted,
  hasSaved,
  itemId,
  userId,
}: Props) => {
  const path = usePathname();
  const router = useRouter();
  const handleSave = async () => {
    if (!userId) {
      return toast({
        title: "Login to save",
        description: "You need to login to save",
      });
    }
    if (type === "Question") {
      await toggleSaveQuestion({
        questionId: JSON.parse(itemId),
        userId: JSON.parse(userId),
        path,
      });
    } else if (type === "Blog") {
      await toggleSaveBlog({
        blogId: JSON.parse(itemId),
        userId: JSON.parse(userId),
        path,
      });
    }
    return toast({
      title: `${type} ${
        !hasSaved ? "Saved in" : "Removed from"
      } Your Collections`,
      variant: !hasSaved ? "default" : "destructive",
    });
  };
  const handleVote = async (voteType: string) => {
    if (!userId) {
      return toast({
        title: "Login to vote",
        description: "You need to login to vote",
      });
    }
    if (voteType === "upvote") {
      if (type === "Question") {
        await upvoteQuestion({
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasupVoted: hasUpvoted,
          hasdownVoted: hasDownvoted,
          path,
        });
      } else if (type === "Answer") {
        await upvoteAnswer({
          answerId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasupVoted: hasUpvoted,
          hasdownVoted: hasDownvoted,
          path,
        });
      } else if (type === "Blog") {
        await upvoteBlog({
          blogId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasupVoted: hasUpvoted,
          hasdownVoted: hasDownvoted,
          path,
        });

      } 
      return toast({
        title: `Upvote ${!hasUpvoted ? "Successull" : "Removed"}`,
        variant: !hasUpvoted ? "default" : "destructive",
      });
    }
    if (voteType === "downvote") {
      if (type === "Question") {
        await downvoteQuestion({
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasupVoted: hasUpvoted,
          hasdownVoted: hasDownvoted,
          path,
        });
      } else if (type === "Answer") {
        await downvoteAnswer({
          answerId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasupVoted: hasUpvoted,
          hasdownVoted: hasDownvoted,
          path,
        });
      } else if (type === "Blog") {
        await downvoteBlog({
          blogId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasupVoted: hasUpvoted,
          hasdownVoted: hasDownvoted,
          path,
        });
      } 
      return toast({
        title: `Downvote ${!hasDownvoted ? "Successull" : "Removed"}`,
        variant: !hasDownvoted ? "default" : "destructive",
      });
    }
  };
  useEffect(() => {
    viewQuestion({
      questionId: JSON.parse(itemId),
      userId: userId ? JSON.parse(userId) : undefined,
    });
    viewBlog({
      blogId: JSON.parse(itemId),
      userId: userId ? JSON.parse(userId) : undefined,
    });
  }, [itemId, userId, path, router]);

  return (
    <div className="flex gap-5">
      <div className="flex-center gap-2.5">
        <div className="flex-center gap-1.5">
          <Image
            src={
              hasUpvoted
                ? "/assets/icons/upvoted.svg"
                : "/assets/icons/upvote.svg"
            }
            alt="upvote"
            width={15}
            height={15}
            className="cursor-pointer"
            onClick={() => handleVote("upvote")}
          />
          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1 ">
            <p className="subtle-medium text-dark400_light900">
              {formatLargeNumber(upvotes)}
            </p>
          </div>
        </div>
        <div className="flex-center gap-1.5">
          <Image
            src={
              hasDownvoted
                ? "/assets/icons/downvoted.svg"
                : "/assets/icons/downvote.svg"
            }
            alt="downvote"
            width={15}
            height={15}
            className="cursor-pointer"
            onClick={() => handleVote("downvote")}
          />
          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1 ">
            <p className="subtle-medium text-dark400_light900">
              {formatLargeNumber(downvotes)}
            </p>
          </div>
        </div>
      </div>

      {type === "Question" || type ==='Blog'  && (
          <Image
            src={
              hasSaved
                ? "/assets/icons/star-filled.svg"
                : "/assets/icons/star-red.svg"
            }
            alt="saved"
            width={15}
            height={15}
            className="cursor-pointer"
            onClick={handleSave}
          />
        )}
        
    </div>
  );
};

export default Votes;
