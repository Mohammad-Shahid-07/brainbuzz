import Image from "next/image";
import Link from "next/link";
import Matric from "../shared/Matric";
import { formatLargeNumber, getTimeStamp } from "@/lib/utils";

interface Props {
  title: string;
  image: string;
  description: string;
  tags: { _id: string; name: string }[];
  author: {
    _id: string;
    name: string;
    image: string;
    username: string;
  };
  upvotes: string[];
  views: number;

  slug: string;
  comments: Array<{}>;
  createdAt: Date;
}
const BlogsCard = ({
  title,
  tags,
  author,
  upvotes,
  slug,
  views,
  comments,
  createdAt,
  description,
  image,
}: Props) => {
  return (
    <div className=" max-w-[450px]  rounded-[10px] p-5 hover:shadow-xl">
      <div className="flex flex-col items-start justify-between gap-5 ">
        <Link href={`/blogs/${slug}`}>
          <div className=" h-fit w-fit ">
            <Image
              src={image}
              width={400}
              height={210}
              alt="header"
              className="rounded-md object-fill "
            />
          </div>
          <div>
            <span className="text-dark400_light700 subtle-regular line-clamp-1 flex max-sm:hidden  ">
              {getTimeStamp(createdAt)}
            </span>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {title}
            </h3>
            <p className="subtle-regular text-light400_light500">
              {description}
            </p>
          </div>
        </Link>
        <div className="flex-between mt-6 w-full flex-wrap gap-3">
          <Matric
            imgURL={author?.image}
            alt="User"
            value={author?.name}
            title={`- asked `}
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
              value={formatLargeNumber(comments.length)}
              title="Comments"
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
    </div>
  );
};

export default BlogsCard;
