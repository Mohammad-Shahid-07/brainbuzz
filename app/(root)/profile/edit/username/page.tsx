import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import NameUser from "@/components/forms/NameUser";
import { getUserById } from "@/lib/actions/user.action";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user || null;
  if (!user) {
    redirect("/signin");
  }
  const userId = session?.user?.id ;
  const mongoUser = await getUserById(userId);

  return (
    <section>
      <div>
        <h1 className="h1-bold text-dark100_light900">Profile</h1>
        <NameUser username={mongoUser?.username} type="Username" />
      </div>
      
    </section>
  );
};

export default Page;
