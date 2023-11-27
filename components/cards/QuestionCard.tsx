import Link from "next/link";
import Matric from "../shared/Matric";
import { formatLargeNumber, getTimeStamp } from "@/lib/utils";
import RenderTags from "../shared/RenderTags";
import { SignedIn } from "@clerk/nextjs";
import EditDeleteAction from "../shared/EditDeleteAction";

interface Props {
  _id: string;
  title: string;
  tags: { _id: string; name: string }[];
  author: {
    _id: string;
    name: string;
    picture: string;
    username: string;
    clerkId: string;
  };
  upvotes: string[];
  views: number;
  clerkId?: string;
  slug: string;
  answers: Array<{}>;
  createdAt: Date;
}

const QuestionCard = ({
  _id,
  title,
  tags,
  author,
  clerkId,
  upvotes,
  slug,
  views,
  answers,
  createdAt,
}: Props) => {
  const showActionButtons = clerkId && clerkId === author?.clerkId;

  return (
    <div className="card-wrapper rounded-[10px] p-9 sm:px-11">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row ">
        <div>
          <span className="text-dark400_light700 subtle-regular line-clamp-1 flex max-sm:hidden  ">
            {getTimeStamp(createdAt)}
          </span>
          <Link href={`/question/${slug}/${_id}`}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {title}
            </h3>
          </Link>
        </div>
        <SignedIn>
          {showActionButtons && (
            <EditDeleteAction type="Question" itemId={JSON.stringify(_id)} />
          )}
        </SignedIn>
      </div>
      <div className="mt-3.5 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <RenderTags key={tag._id} name={tag.name} id={tag._id} />
        ))}
      </div>
      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Matric
          imgURL={`${author?.picture}`}
          alt="User"
          value={author?.name}
          title={`- asked ${getTimeStamp(createdAt)}`}
          textStyles="body-medium text-dark400_light700"
          href={`/profile/${author?.username}`}
          isauthor
        />
        <Matric
          imgURL="/assets/icons/like.svg"
          alt="Upvotes"
          value={formatLargeNumber(upvotes.length)}
          title="Votes"
          textStyles="small-medium text-dark400_light900"
        />
        <Matric
          imgURL="/assets/icons/message.svg"
          alt="message"
          value={formatLargeNumber(answers.length)}
          title="Answers"
          textStyles="small-medium text-dark400_light900"
        />
        <Matric
          imgURL="/assets/icons/eye.svg"
          alt="eye"
          value={formatLargeNumber(views)}
          title="Views"
          textStyles="small-medium text-dark400_light900"
        />
      </div>
    </div>
  );
};

export default QuestionCard;
