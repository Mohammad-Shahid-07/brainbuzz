import Question from "@/components/forms/Question";
import { getUserById } from "@/lib/actions/user.action";

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import VerificationButton from "@/components/shared/VerificationButton";
const Page = async () => {
  const session = await getServerSession(authOptions);

  const userId = session?.user?.id || null;
  if (!userId) redirect("/signin");

  const user = await getUserById(userId);

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Ask a Question</h1>
      <div className="mt-9">
        <VerificationButton email={user?.email}  classes='mb-5'/>
        <Question
          mongoUserId={JSON.stringify(user?._id)}
          isVerified={user?.isVerified}
          type="Question"
        />
      </div>
    </div>
  );
};

export default Page;
