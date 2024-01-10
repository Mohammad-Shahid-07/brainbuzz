import Profile from "@/components/forms/Profile";
import { getUserById } from "@/lib/actions/user.action";
import { URLProps } from "@/types";
import UserAccount from "@/components/shared/UserAccount";
import Link from "next/link";
import Image from "next/image";

import { currentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import TwoFactorToggler from "@/components/forms/TwoFactorToggler";
import { DeleteButton } from "@/components/shared/DeleteButton";

const page = async ({ params }: URLProps) => {
  const sessionUser = await currentUser();
  if (!sessionUser) redirect("/login");

  const mongoUser = await getUserById();

  return (
    <>
      <section>
        <UserAccount mongoUser={JSON.stringify(mongoUser)} />
        <div className="mt-9">
          <Profile
            userId={JSON.stringify(mongoUser._id)}
            user={JSON.stringify(mongoUser)}
          />
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
        {mongoUser?.password ? (
          <Link
            href="/profile/edit/change-password"
            className="  mt-3 flex items-center gap-2 rounded-lg p-2  transition-all hover:-translate-y-1 hover:bg-[#94a4de50] motion-reduce:transition-none motion-reduce:hover:transform-none"
          >
            <Image
              src="/assets/icons/edit.svg"
              alt="arrow"
              width={15}
              height={15}
            />
            <p className="subtle-regular  text-blue-500">Change Password</p>
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
        {mongoUser?.password && (
          <TwoFactorToggler user={JSON.stringify(mongoUser)} />
        )}
      </section>
      <section className="mt-10">
      <h1 className="h1-bold text-red-500">Danger</h1>
        <p className="text-dark200_light800">
        Once you delete your account, there is no going back. Please be certain.
        </p>
        <DeleteButton />
      </section>
    </>
  );
};

export default page;
