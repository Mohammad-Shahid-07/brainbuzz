import Question from "@/components/forms/Question";
import { getUserById } from "@/lib/actions/user.action";


import VerificationButton from "@/components/shared/VerificationButton";
const Page = async () => {

  const user = await getUserById(true);

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Ask a Question</h1>
      <div className="mt-9">
      {!user?.isVerified &&  <VerificationButton email={user?.email}  classes='mb-5'/>}
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
