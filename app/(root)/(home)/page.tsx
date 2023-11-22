import QuestionCard from "@/components/cards/QuestionCard";
import HomeFilters from "@/components/home/HomeFilters";
import Filter from "@/components/shared/Filter";
import NoResults from "@/components/shared/NoResults";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filters";
import Link from "next/link";

const questions = [
  {
    _id: "1",
    title: "Cascading Deletes in SQLAlchemy?",
    tags: [{ _id: "1", name: "python" }],
    author: { _id: "101", name: "John Doe", picture: "john-doe.jpg" },
    upvotes: 10,
    views: 100,
    answers: [{}], // Replace with a more specific type if needed
    createdAt: new Date(),
  },
  {
    _id: "2",
    title: "Responsive Design Techniques?",
    tags: [
      { _id: "2", name: "html" },
      { _id: "3", name: "css" },
    ],
    author: { _id: "102", name: "Jane Smith", picture: "jane-smith.jpg" },
    upvotes: 15,
    views: 120,
    answers: [{}], // Replace with a more specific type if needed
    createdAt: new Date(),
  },
  // Add more objects with random values as needed
];

export default function Home() {
  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center ">
        <h1 className="h1-bold text-dark100_light900 ">All Questions</h1>
        <Link href="/ask-question" className="flex justify-end max-sm:w-full ">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
            Ask Question
          </Button>
        </Link>
      </div>
      <div className="mt-11 flex  justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for a specific question"
          otherClasses="flex-1"
        />
        <Filter
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </div>
      <HomeFilters />
      <div className="mt-10 flex w-full flex-col gap-6">
        {questions.length > 0 ? (
          questions.map((question) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
              title={question.title}
              tags={question.tags}
              author={question.author}
              upvotes={question.upvotes}
              views={question.views}
              answers={question.answers}
              createdAt={question.createdAt}
            />
          ))
        ) : (
          <NoResults
            title="There's no Questions to show"
            discription="Be the first one to ask a question! ask a question! ask a question! and ask a question! get it?"
            link="/ask-question"
            linkText="Ask a Question"
          />
        )}
      </div>
    </>
  );
}
