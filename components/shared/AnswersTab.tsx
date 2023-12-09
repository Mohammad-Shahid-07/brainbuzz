import { getUserAnswers } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import AnswerCard from "../cards/AnswerCard";
import Pagination from "./Pagination";

interface Props extends SearchParamsProps {
  userId: string;

}

const AnswersTab = async ({ searchParams, userId }: Props) => {
  const res = await getUserAnswers({
    userId,
    page: searchParams.page ? +searchParams.page : 1,
  });

  return (
    <>
      {res?.userAnswers.map((answer) => (
        <AnswerCard
          key={answer._id}
          userId={userId}
          _id={answer._id}
          author={answer.author}
          upvotes={answer.upvotes}
          question={answer.question}
          createdAt={answer.createdAt}
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

export default AnswersTab;
