import { LoginForm } from "@/components/auth/LoginForm";
import { currentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import React from "react";

const Page = async() => {
  const user = await currentUser();
  if (user) {
    redirect("/");
  }
  return (
    <section className="flex items-center justify-center">
      <LoginForm />
    </section>
  );
};

export default Page;
