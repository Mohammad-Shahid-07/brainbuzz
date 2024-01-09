import NameUser from "@/components/forms/NameUser";
import { currentUser } from "@/lib/session";
import { redirect } from "next/navigation";

const Page = async () => {
  const sessionUser = await currentUser();
  if (!sessionUser) redirect("/login");
  const username = sessionUser?.username;
  return (
    <section>
      <div>
        <h1 className="h1-bold text-dark100_light900">Profile</h1>
        <NameUser username={username} type="Username" />
      </div>
    </section>
  );
};

export default Page;
