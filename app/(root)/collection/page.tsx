import QuestionCard from "@/components/cards/QuestionCard";
import Filter from "@/components/shared/Filter";
import NoResults from "@/components/shared/NoResults";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";

import { QuestionFilters } from "@/constants/filters";
import { getSavedQuestions } from "@/lib/actions/question.action";

import { auth } from "@clerk/nextjs";
import { IQuestion } from "@/database/question.model";
import { SearchParamsProps } from "@/types";
import Pagination from "@/components/shared/Pagination";

export default async function Home({searchParams}: SearchParamsProps) {

  const { userId } = auth();
  if (!userId) return null;
  const res = await getSavedQuestions({
    clerkId: userId,
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page: searchParams.page ?  +searchParams.page : 1,
  });
  

  return (
    <>
      <h1 className="h1-bold text-dark100_light900 ">Saved Questions</h1>

      <div className="mt-11 flex  justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/collection"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for a specific question"
          otherClasses="flex-1"
        />

        <Filter
          filters={QuestionFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>

      <div className="mt-10 flex w-full flex-col gap-6">
        {res.questions.length > 0 ? (
          res.questions.map((question: IQuestion) => (
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
        pageNumber={searchParams?.page? +searchParams.page : 1}
        isNext={res.isNext}
        />
      </div>
    </>
  );
}
