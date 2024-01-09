import Question from "@/components/forms/Question";
import { getUserById } from "@/lib/actions/user.action";



const Page = async () => {
  
  const user = await getUserById();

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Ask a Question</h1>
      <div className="mt-9">
      
        <Question
          mongoUserId={JSON.stringify(user?._id)}
          type="Question"
        />
      </div>
    </div>
  );
};

export default Page;
