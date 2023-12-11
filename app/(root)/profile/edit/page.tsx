import Profile from "@/components/forms/Profile";
import { getUserById } from "@/lib/actions/user.action";
import { URLProps } from "@/types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import UserAccount from "@/components/shared/UserAccount";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "@/components/ui/use-toast";
import VerificationButton from "@/components/shared/VerificationButton";

const page = async ({ params }: URLProps) => {
  const session = await getServerSession(authOptions);

  const userId = session?.user?.id || null;
  if (!userId) {
    return redirect("/signin");
  }

  const mongoUser = await getUserById(userId);
  if (!mongoUser.isVerified) {
    toast({
      title: "Your email is not verified",
      description: "Please verify your email first.",
      variant: "destructive",
    });
  }
  return (
    <>
      <section>
      {!mongoUser?.isVerified &&   <VerificationButton email={mongoUser?.email} classes="my-5" />}
        <UserAccount mongoUser={JSON.stringify(mongoUser)} />
        <div className="mt-9">
          <Profile userId={userId} user={JSON.stringify(mongoUser)} />
        </div>
      </section>
      <section className="mt-9">
        <h1 className="h1-bold text-dark100_light900">Security</h1>
        <p className="text-dark200_light800">
          Manage your security preferences
        </p>
        <p className="paragraph-semibold text-dark400_light800 mt-3">
          Password
        </p>
        {mongoUser.hashedPassword ? (
          <Link
            href="/profile/edit/change-password"
            className="ml-2 flex items-center gap-2 rounded-lg p-2  transition-all hover:-translate-y-1 hover:bg-[#94a4de50] motion-reduce:transition-none motion-reduce:hover:transform-none"
          >
            <Image
              src="/assets/icons/edit.svg"
              alt="arrow"
              width={15}
              height={15}
            />
            <p className="subtle-regular text-blue-500">Change Password</p>
          </Link>
        ) : (
          <Link
            href="/profile/edit/set-password"
            className="ml-2 flex items-center gap-2 rounded-lg p-2  transition-all hover:-translate-y-1 hover:bg-[#94a4de50] motion-reduce:transition-none motion-reduce:hover:transform-none"
          >
            <Image
              src="/assets/icons/edit.svg"
              alt="arrow"
              width={15}
              height={15}
            />
            <p className="subtle-regular text-blue-500">Set Password</p>
          </Link>
        )}
      </section>
    </>
  );
};

export default page;
