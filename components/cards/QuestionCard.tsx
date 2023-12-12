import Link from "next/link";
import Matric from "../shared/Matric";
import { formatLargeNumber, getTimeStamp } from "@/lib/utils";
import RenderTags from "../shared/RenderTags";
import EditDeleteAction from "../shared/EditDeleteAction";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface Props {
  _id: string;
  title: string;
  tags: { _id: string; name: string }[];
  userId?: string | null;
  author: {
    _id: string;
    name: string;
    image: string;
    username: string;
  };
  upvotes: string[];
  views: number;
  slug: string;
  answers: Array<{}>;
  createdAt: Date;
}

const QuestionCard = async ({
  _id,
  title,
  tags,
  author,
  upvotes,
  userId,
  slug,
  views,
  answers,
  createdAt,
}: Props) => {
  const session = await getServerSession(authOptions);
  const user = session?.user?.id || null;
  const showActionButtons = user && user === author?._id.toString();
  
  return (
    <div className="card-wrapper rounded-[10px] p-9 shadow-xl sm:px-11">
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

        {session && showActionButtons && (
          <EditDeleteAction type="Question" itemId={JSON.stringify(_id)} />
        )}
      </div>
      <div className="mt-3.5 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <RenderTags key={tag._id} name={tag.name} id={tag._id} />
        ))}
      </div>
      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Matric
          imgURL={`${author?.image || "/assets/icons/user.svg"}`}
          alt="User"
          value={author?.name}
          title={`- asked ${getTimeStamp(createdAt)}`}
          textStyles="body-medium text-dark400_light700"
          href={`/profile/${author?.username}`}
          isauthor
        />
        <div className="flex items-center gap-3 max-sm:flex-wrap max-sm:justify-start">
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
    </div>
  );
};

export default QuestionCard;
