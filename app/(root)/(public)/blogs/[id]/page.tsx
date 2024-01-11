import Matric from "@/components/shared/Matric";
import ParseHTML from "@/components/shared/ParseHTML";
import RenderTags from "@/components/shared/RenderTags";
import Votes from "@/components/shared/Votes";
import { getBlogBySlug } from "@/lib/actions/blog.action";
import { getUserById } from "@/lib/actions/user.action";
import { formatLargeNumber, getTimeStamp } from "@/lib/utils";
import { URLProps } from "@/types";
import Image from "next/image";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: {
    id: string;
  };
}) {
  try {
    const blog = await getBlogBySlug({ slug: params.id });

    if (!blog)
      return {
        title: "Not Found",
        description: "The page you are looking for does not exist.",
      };

    return {
      title: blog?.title,
      description: blog?.description,
      alternates: {
        canonical: `/blogs/${params.id}`,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      title: "Not Found",
      description: "The page you are looking for does not exist.",
    };
  }
}

const Page = async ({ params, searchParams }: URLProps) => {
  const res = await getBlogBySlug({ slug: params.id });

  const mongoUser = await getUserById();

  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <Link
            href={
              res?.author?.username ? `/profile/${res.author.username}` : "#"
            }
            className="flex items-center justify-start gap-1"
          >
            <Image
              src={res?.author?.image || "/assets/images/deleted.jpg"}
              alt="Picture of the author"
              width={40}
              height={40}
              className="rounded-full"
            />
            {res?.author?.name ? (
              <p className="paragraph-semibold text-dark300_light700">
                {res?.author?.name}
              </p>
            ) : (
              <p className="paragraph-semibold text-red-500">Deleted Account</p>
            )}
          </Link>
          <div className="flex justify-end">
            <Votes
              type="Blog"
              upvotes={res?.upvotes?.length}
              hasUpvoted={res?.upvotes.includes(mongoUser?._id)}
              downvotes={res?.downvotes?.length}
              hasDownvoted={res?.downvotes.includes(mongoUser?._id)}
              hasSaved={mongoUser?.savedBlogs.includes(res?._id)}
              itemId={JSON.stringify(res?._id)}
              userId={JSON.stringify(mongoUser?._id)}
            />
          </div>
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
          {res?.title}
        </h2>
      </div>
      <div className="mb-8 mt-5  flex w-full flex-wrap gap-3">
        <Matric
          imgURL="/assets/icons/clock.svg"
          alt="clock"
          value={`- Posted ${getTimeStamp(res?.createdAt)}`}
          title=""
          textStyles="small-medium text-dark400_light900"
        />
        <Matric
          imgURL="/assets/icons/message.svg"
          alt="message"
          value={formatLargeNumber(res?.comments?.length)}
          title="Comments"
          textStyles="body-medium text-dark400_light700"
          isauthor
        />

        <Matric
          imgURL="/assets/icons/eye.svg"
          alt="eye"
          value={formatLargeNumber(res?.views.toString())}
          title="Views"
          textStyles="small-medium text-dark400_light900"
        />
      </div>
      <div className="mt-8 flex flex-wrap gap-2">
        {res?.tags.map((tag: any) => (
          <RenderTags
            key={tag?._id}
            name={tag?.name}
            id={tag?._id}
            showCount={false}
          />
        ))}
      </div>
      <ParseHTML data={res?.content} />

      <div className="mt-8">
        <div className="mt-5 h-[2px] bg-light-700/50 dark:bg-dark-500/50" />
        <div className="mt-11 flex  justify-between gap-5 max-sm:flex-col sm:items-center">
          <Matric
            imgURL="/assets/icons/message.svg"
            alt="Comments"
            value={formatLargeNumber(res?.comments?.length)}
            title="Comments"
            textStyles="!h2-bold text-dark400_light700"
            isauthor
            height={50}
            width={50}
          />
        </div>
      </div>
    </>
  );
};

export default Page;
