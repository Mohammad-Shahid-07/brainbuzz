import { AnswerFilters } from "@/constants/filters";
import React from "react";
import Filters from "./Filter";
import { getAnswers } from "@/lib/actions/answer.action";
import Link from "next/link";
import Image from "next/image";
import { getTimeStamp } from "@/lib/utils";
import ParseHTML from "./ParseHTML";
import Votes from "./Votes";
import Pagination from "./Pagination";
import { SearchParamsProps } from "@/types";
import { getUserById } from "@/lib/actions/user.action";

interface Props extends SearchParamsProps {
  questionId: string;
  userId: string;
  totalAnswers: number;
  filter?: string;
}

const AllAnswers = async ({
  questionId,
  userId,
  totalAnswers,
  filter,
  searchParams,
}: Props) => {
  const res = await getAnswers({
    questionId: JSON.parse(questionId),
    page: searchParams?.page ? +searchParams.page : 1,
    sortBy: filter || "newest",
  });
  
  const mongoUser = await getUserById();

  return (
    <div className="mt-11 ">
      <div className="flex items-center justify-between">
        <h3 className="primary-text-gradient">{totalAnswers} Answers </h3>
        <Filters filters={AnswerFilters} />
      </div>
      <div>
        {res?.answers.map((answer) => (
          <article
            key={answer._id}
            className="light-border mt-5 border-b py-10 "
          >
            <div className="mb-8 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
              <Link
                href={`/profile/${answer.author[0].username}`}
                className="flex items-start gap-1 sm:items-center"
              >
                <Image
                  src={answer.author[0].image}
                  alt="Picture of the author"
                  width={18}
                  height={18}
                  className="rounded-full object-cover max-sm:mt-0.5"
                />
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <p className="body-semibold text-dark300_light700">
                    {answer.author[0].name}
                  </p>
                  <p className="small-regular text-light400_light500 mt-0.5 line-clamp-1">
                    <span className="max-sm:hidden">-</span>
                    answered {getTimeStamp(answer.createdAt)}
                  </p>
                </div>
              </Link>
              <div className="flex justify-end">
                <Votes
                  type="Answer"
                  upvotes={answer.upvotes.length}
                  hasUpvoted={answer.upvotes.includes(userId)}
                  downvotes={answer.downvotes.length}
                  hasDownvoted={answer.downvotes.includes(userId)}
                  itemId={JSON.stringify(answer._id)}
                  isVerified={mongoUser?.isVerified}
                  userId={JSON.stringify(userId)}
                />
              </div>
            </div>
            <ParseHTML data={answer.content} />
          </article>
        ))}
      </div>
      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={res?.isNext}
        />
      </div>
    </div>
  );
};

export default AllAnswers;
