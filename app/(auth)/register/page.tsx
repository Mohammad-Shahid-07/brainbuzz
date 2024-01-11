import { RegisterForm } from "@/components/auth/RegisterForm";
import { currentUser } from "@/lib/session";
import { redirect } from "next/navigation";

const Page = async() => {
  const user = await currentUser();
  if (user) {
    redirect("/");
  }
  return (
    <div className="mt-5 flex items-center justify-center">
      <RegisterForm />
    </div>
  );
};

export default Page;
