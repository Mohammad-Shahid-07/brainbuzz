import Image from "next/image";
import Link from "next/link";
import React from "react";
interface Props {
  mongoUser: string;
}
interface User {
  _id: string;
  name: string;
  username: string;
  image: string;
}
const UserAccount = ({ mongoUser }: Props) => {
  const user = JSON.parse(mongoUser) as User;

  return (
    <div>
      {" "}
      <h1 className="h1-bold text-dark100_light900">Account</h1>
      <p className="text-dark200_light800">Manage your account information</p>
      <div className="mt-5">
        <p className="paragraph-semibold text-dark400_light800">Profile</p>
        <Link href="/profile/edit/avatar">
          <div className="group flex items-center justify-between ">
            <div className=" flex items-center gap-5 py-5">
              <Image
                src={user?.image || "/assets/icons/user.svg"}
                className="rounded-full "
                alt="profile"
                width={60}
                height={60}
              />
              <h2 className="h3-bold  text-dark100_light900">{user?.name}</h2>
            </div>
            <Image
              src="/assets/icons/arrow-right.svg"
              alt="arrow"
              width={20}
              height={20}
              className="hidden cursor-pointer opacity-0 transition-all duration-300 ease-in-out group-hover:block group-hover:translate-x-[-2px] group-hover:opacity-100"
            />
          </div>
        </Link>

        <p className="paragraph-semibold text-dark400_light800 mt-3">
          Username
        </p>
        <p className="text-dark200_light800  ml-2 py-3">{user?.username}</p>
        <Link
          href="/profile/edit/username"
          className="ml-2 flex items-center gap-2 rounded-lg p-2  transition-all hover:-translate-y-1 hover:bg-[#94a4de50] motion-reduce:transition-none motion-reduce:hover:transform-none"
        >
          <Image
            src="/assets/icons/edit.svg"
            alt="arrow"
            width={15}
            height={15}
          />
          <p className="subtle-regular text-blue-500">Change Username</p>
        </Link>
      </div>
    </div>
  );
};

export default UserAccount;
