import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import NameUser from "@/components/forms/NameUser";
import ChooseAvatar from "@/components/shared/ChooseAvatar";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user || null;
  if (!user) {
    redirect("/signin");
  }

  return (
    <section>
      <div>
        <h1 className="h1-bold text-dark100_light900">Profile</h1>
        <NameUser name={user?.name!} type="Name" />
      </div>
      <div>
        <h1 className="h1-bold text-dark100_light900">Choose an avatar</h1>
        <ChooseAvatar />
      </div>
    </section>
  );
};

export default Page;
