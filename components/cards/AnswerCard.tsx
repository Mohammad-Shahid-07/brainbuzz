import Link from "next/link";

import { formatLargeNumber, getTimeStamp } from "@/lib/utils";
import Matric from "../shared/Matric";
import EditDeleteAction from "../shared/EditDeleteAction";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface Props {
  userId?: string | null;
  _id: string;
  question: {
    _id: string;
    title: string;
    slug: string;
  };
  author: [
    {
      _id: string;
      name: string;
      image: string;
      username: string;
    },
  ];
  upvotes: number;
  createdAt: Date;
}

const AnswerCard = async ({
  userId,
  _id,
  question,
  author,
  upvotes,
  createdAt,
}: Props) => {
  const showActionButtons = userId && userId === author[0]?._id.toString();
  const session = await getServerSession(authOptions);

  return (
    <Link
      href={`/question/${question.slug}/${question._id}/#${_id}`}
      className="card-wrapper rounded-[10px] px-11 py-9"
    >
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimeStamp(createdAt)}
          </span>
          <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
            {question.title}
          </h3>
        </div>

        {session && showActionButtons && (
          <EditDeleteAction type="Answer" itemId={JSON.stringify(_id)} />
        )}
      </div>

      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Matric
          imgURL={author[0]?.image}
          alt="user avatar"
          value={author[0].name}
          title={`asked ${getTimeStamp(createdAt)}`}
          href={`/profile/${author[0].username}`}
          textStyles="body-medium text-dark400_light700"
        />

        <div className="flex-center gap-3">
          <Matric
            imgURL="/assets/icons/like.svg"
            alt="like icon"
            value={formatLargeNumber(upvotes)}
            title=" Votes"
            textStyles="small-medium text-dark400_light800"
          />
        </div>
      </div>
    </Link>
  );
};

export default AnswerCard;
