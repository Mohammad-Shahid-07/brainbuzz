import ChatCard from "@/components/cards/ChatCard";
import SpeakUi from "@/components/chat/SpeakUi";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Page = async () => {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  const user = await getUserById(userId);
  return (
    <div className="flex w-full flex-col justify-between gap-4  sm:items-center ">
      <h1 className="h1-bold text-dark100_light900 ">Chat</h1>
      <div className="flex flex-wrap items-center justify-center gap-5 ">
        <ChatCard />
        <ChatCard />
        <ChatCard />
      </div>
      <SpeakUi user={JSON.stringify(user._id)} />
    </div>
  );
};

export default Page;
