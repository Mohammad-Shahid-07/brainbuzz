import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Password from "@/components/forms/Password";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await getServerSession(authOptions);

  const userId = session?.user?.id || null;
  if (!userId) {
    return redirect("/signin");
  }
  return (
    <div>
      <Password type="Change Password" userId={userId} />
    </div>
  );
};

export default Page;
