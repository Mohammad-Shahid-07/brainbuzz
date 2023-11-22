import Link from "next/link";
import Matric from "../shared/Matric";
import { formatLargeNumber } from "@/lib/utils";

interface Props {
  _id: string;
  title: string;
  tags: { _id: string; name: string }[];
  author: { _id: string; name: string; picture: string };
  upvotes: number;
  views: number;
  answers: Array<{}>;
  createdAt: Date;
}

const QuestionCard = ({
  _id,
  title,
  tags,
  author,
  upvotes,
  views,
  answers,
  createdAt,
}: Props) => {
  return (
    <div className="card-wrapper rounded-[10px] p-9 sm:px-11">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row ">
        <div>
          <span className="text-dark400_light700 subtle-regular line-clamp-1 flex sm:hidden  ">
            {new Date(createdAt).toLocaleDateString()}
          </span>
          <Link href={`/question/${_id}`}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {title}
            </h3>
          </Link>
        </div>
        {/* If Signedin add edit delete */}
      </div>
      <div className="mt-3.5 flex flex-wrap gap-2">
        {tags.map((tag) => (
          //   <RanderTag key={tag._id}  name={tag.name} />
          <h3   key={tag._id}>tag</h3>
        ))}
      </div>
      <div className="flex-between mt-6 w-full flex-wrap gap-3">
      <Matric
          imgURL="/assets/icons/avatar.svg"
          alt="User"
          value={author.name}
          title="- asked 1 Hour ago"
          textStyles="body-medium text-dark400_light700"
          href={`/profile/${author._id}`}
          isAuther
        />
        <Matric
          imgURL="/assets/icons/like.svg"
          alt="Upvotes"
          value={formatLargeNumber(upvotes)}
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
