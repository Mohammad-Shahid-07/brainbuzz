import { getUserQuestions } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import QuestionCard from "../cards/QuestionCard";
import Pagination from "./Pagination";
import { getSavedQuestions } from "@/lib/actions/question.action";

interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string;
  route?: string;
}
const QuestionsTab = async ({
  searchParams,
  userId,
  clerkId,
  route,
}: Props) => {
  let res;
  if (route === "/collection") {
    res = await getSavedQuestions({
      clerkId: clerkId || "",
      page: searchParams.page ? +searchParams.page : 1,
    });
  } else {
    res = await getUserQuestions({
      userId,
      page: searchParams.page ? +searchParams.page : 1,
    });
  }


  return (
    <>
      {res?.questions.map((question: any) => (
        <QuestionCard
          key={question._id}
          _id={question._id}
          clerkId={clerkId}
          title={question.title}
          tags={question.tags}
          author={question.author}
          upvotes={question.upvotes}
          views={question.views}
          slug={question.slug}
          answers={question.answers}
          createdAt={question.createdAt}
        />
      ))}
      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={res?.isNext}
        />
      </div>
    </>
  );
};

export default QuestionsTab;
