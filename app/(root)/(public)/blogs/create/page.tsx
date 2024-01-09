import Question from "@/components/forms/Question";
import { getUserById } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";

const Page = async () => {
  const user = await getUserById();

  if (!user?.owner) redirect("/blogs");

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Write A blog</h1>
      <div className="mt-9">
        <Question
          mongoUserId={JSON.stringify(user?._id)}
        
          type="Blog"
        />
      </div>
    </div>
  );
};

export default Page;
