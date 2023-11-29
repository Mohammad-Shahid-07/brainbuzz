import QuestionCard from "@/components/cards/QuestionCard";
import NoResults from "@/components/shared/NoResults";
import Pagination from "@/components/shared/Pagination";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { getQuestionByTagName } from "@/lib/actions/tag.actions";
import { URLProps } from "@/types";

export async function generateMetadata({
  params,
}: {
  params: {
    id: string;
  };
}) {
  try {
    return {
      title: params?.id,
      description: `Get all the questions related to ${params?.id}`,
      alternates: {
        canonical: `/tags/${params.id}`,
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
  const res = await getQuestionByTagName({
    tagName: params?.id,
    page: searchParams.page ? +searchParams.page : 1,
    searchQuery: searchParams.q,
  });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900 capitalize ">
        {res?.tagTitle}
      </h1>

      <div className="mt-11 w-full">
        <LocalSearchbar
          route={`/tags/${params?.id}`}
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for a specific question"
          otherClasses="flex-1"
        />
      </div>

      <div className="mt-10 flex w-full flex-col gap-6">
        {res?.questions.length > 0 ? (
          res?.questions.map((question: any) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
              title={question.title}
              tags={question.tags}
              author={question.author}
              upvotes={question.upvotes}
              views={question.views}
              slug={question.slug}
              answers={question.answers}
              createdAt={question.createdAt}
            />
          ))
        ) : (
          <NoResults
            title="There are no Saved Questions"
            discription="Be the first one to ask a question! ask a question! ask a question! and ask a question! get it?"
            link="/ask-question"
            linkText="Ask a Question"
          />
        )}
      </div>
      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={res?.isNext}
        />
      </div>
    </>
  );
};

export default Page;
