import Question from "@/components/forms/Question";
import { getUserById } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
const Page = async () => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id || null;
  if (!userId) redirect("/sign-in");

  const user = await getUserById(userId);

  if (!user?.owner) redirect("/blogs");

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Write A blog</h1>
      <div className="mt-9">
        <Question mongoUserId={JSON.stringify(user?._id)} type="Blog" />
      </div>
    </div>
  );
};

export default Page;
