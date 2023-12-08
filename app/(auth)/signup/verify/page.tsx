import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
const Verify = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div>
      Verified
      <pre>{JSON.stringify(session)}</pre>
    </div>
  );
};

export default Verify;
