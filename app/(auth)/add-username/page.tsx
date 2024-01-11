import { UsernameForm } from "@/components/auth/UsernameForm";
import { currentUser } from "@/lib/session";
import { processEmailForUsername } from "@/lib/utils";
import { redirect } from "next/navigation";

const Page = async () => {
  const user = await currentUser();
  if (!user) {
    redirect("/login");
  }
  const username = processEmailForUsername(user.email!);

  if (username !== user.username) {
    redirect("/");
  }
  return (
    <section className="flex items-center justify-center">
      <UsernameForm />
    </section>
  );
};

export default Page;
