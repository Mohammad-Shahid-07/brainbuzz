
import Password from "@/components/forms/Password";
import { currentUser } from "@/lib/session";
import { redirect } from "next/navigation";

const Page = async () => {
  const sessionUser = await currentUser();
  const userId = sessionUser?.id || null;
  if(!userId) redirect("/login");



  return (
    <div>
      <Password type="Change Password" userId={userId} />
    </div>
  );
};

export default Page;
