import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const page = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return redirect("/signin");
  }
  return (
    <div>
      <h1>Profile</h1>
      <pre>{JSON.stringify(session)}</pre>
    </div>
  );
};

export default page;
