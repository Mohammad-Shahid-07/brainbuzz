"use client";

import { useRouter } from "next/navigation";
import { Dialog } from "../ui/dialog";
import { DialogContent, DialogTrigger } from "@radix-ui/react-dialog";
import { LoginForm } from "./LoginForm";
import React from "react";

interface LoginButtonProps {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
}
const LoginButton = ({ children, mode, asChild }: LoginButtonProps) => {
  const router = useRouter();
  const handleClick = () => {
    router.push("/login");
  };
  if (mode === "modal") {
    return (
      <Dialog>
        <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
        <DialogContent className="w-auto border-none bg-gray-500/50 p-0">
          <LoginForm />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <span onClick={handleClick} className="cursor-pointer">
      {children}
    </span>
  );
};

export default LoginButton;
