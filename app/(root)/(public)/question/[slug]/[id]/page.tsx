
import Answer from "@/components/forms/Answer";
import AllAnswers from "@/components/shared/AllAnswers";
import Matric from "@/components/shared/Matric";
import ParseHTML from "@/components/shared/ParseHTML";
import RenderTags from "@/components/shared/RenderTags";
import Votes from "@/components/shared/Votes";
import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";
import { formatLargeNumber, getTimeStamp } from "@/lib/utils";
import { URLProps } from "@/types";
import Image from "next/image";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: {
    slug: string;
    id: string;
  };
}) {
  try {
    const question = await getQuestionById({ questionId: params.id });
    if (!question)
      return {
        title: "Not Found",
        description: "The page you are looking for does not exist.",
      };

    return {
      title: question?.title,
      description: question?.content,
      alternates: {
        canonical: `/question/${params.slug}/${params.id}`,
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
  const res = await getQuestionById({ questionId: params.id });


  const mongoUser = await getUserById();
  

  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <Link
            href={`/profile/${res?.author?.username}`}
            className="flex items-center justify-start gap-1"
          >
            <Image
              src={res?.author?.image}
              alt="Picture of the author"
              width={40}
              height={40}
              className="rounded-full"
            />
            <p className="paragraph-semibold text-dark300_light700">
              {res?.author?.name}
            </p>
          </Link>
          <div className="flex justify-end">
            <Votes
              type="Question"
              upvotes={res?.upvotes?.length}
              hasUpvoted={res?.upvotes.includes(mongoUser?._id)}
              downvotes={res?.downvotes?.length}
              hasDownvoted={res?.downvotes.includes(mongoUser?._id)}
              hasSaved={mongoUser?.saved.includes(res?._id)}
            
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
          value={`- asked ${getTimeStamp(res?.createdAt)}`}
          title=""
          textStyles="small-medium text-dark400_light900"
        />
        <Matric
          imgURL="/assets/icons/message.svg"
          alt="User"
          value={formatLargeNumber(res?.answers?.length)}
          title="Answers"
          textStyles="body-medium text-dark400_light700"
          href={`/profile/${res?.author?._id}`}
          isauthor
        />

        <Matric
          imgURL="/assets/icons/eye.svg"
          alt="message"
          value={formatLargeNumber(res?.views)}
          title="Views"
          textStyles="small-medium text-dark400_light900"
        />
      </div>
      <ParseHTML data={res?.content} />

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
      <AllAnswers
        questionId={JSON.stringify(params.id)}
        totalAnswers={res?.answers.length}
        userId={mongoUser?._id}
        filter={searchParams?.filter}
        searchParams={searchParams}
      />
      <Answer
        question={res?.content}
        authorId={JSON.stringify(mongoUser?._id)}
        questionId={JSON.stringify(res?._id)}
      />
    </>
  );
};

export default Page;
