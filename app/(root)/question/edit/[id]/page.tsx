import Question from "@/components/forms/Question";
import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";
import { URLProps } from "@/types";


import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

  const page = async ({ params }: URLProps) => {
  const session = await getServerSession(authOptions);

  const userId = session?.user?.id || null;
  if (!userId) redirect("/sign-in");
 

  const mongoUser = await getUserById(userId);
  const res = await getQuestionById({ questionId: params.id });
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Question</h1>
      <div className="mt-9">
        <Question
          type="Edit"
          mongoUserId={JSON.stringify(mongoUser?._id)}
          questionDetails={JSON.stringify(res)}
        />
      </div>
    </>
  );
};

export default page;
