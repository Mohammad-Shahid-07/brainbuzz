import NameUser from "@/components/forms/NameUser";
import ChooseAvatar from "@/components/shared/ChooseAvatar";
import { currentUser } from "@/lib/session";
import { redirect } from "next/navigation";

const Page = async () => {
  const sessionUser = await currentUser();
  if (!sessionUser) redirect("/login");
  const name = sessionUser?.name;

  return (
    <section>
      <div>
        <h1 className="h1-bold text-dark100_light900">Profile</h1>
        <NameUser name={name!} type="Name" />
      </div>
      <div>
        <h1 className="h1-bold text-dark100_light900">Choose an avatar</h1>
        <ChooseAvatar />
      </div>
    </section>
  );
};

export default Page;
