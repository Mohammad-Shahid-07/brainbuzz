import Profile from "@/components/forms/Profile";
import { getUserById } from "@/lib/actions/user.action";
import { URLProps } from "@/types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import UserAccount from "@/components/shared/UserAccount";
import { redirect } from "next/navigation";

const page = async ({ params }: URLProps) => {
  const session = await getServerSession(authOptions);

  const userId = session?.user?.id || null;
  if (!userId) {
    return redirect("/signin");
  }

  const mongoUser = await getUserById(userId);

  return (
    <>
      <section>
        <UserAccount mongoUser={JSON.stringify(mongoUser)}/>
        <div className="mt-9">
          <Profile userId={userId} user={JSON.stringify(mongoUser)} />
        </div>
      </section>
      <section className="mt-9">
        <h1 className="h1-bold text-dark100_light900">Security</h1>
        <p className="text-dark200_light800">
          Manage your security preferences
        </p>
      </section>
    </>
  );
};

export default page;
