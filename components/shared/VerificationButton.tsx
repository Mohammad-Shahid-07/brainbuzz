"use client";

import { sendverifyEmail } from "@/lib/actions/user.action";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";

const VerificationButton = ({
  email,
  classes,
}: {
  classes?: string;
  email: string;
}) => {
  const handleEmailSent = async () => {
    try {
      await sendverifyEmail(email)

      toast({
        title: "Email Sent",
        description: "Please check your email for verification link.",
        variant: "success",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };
  return (
    <div className={classes}>
      <Button
        onClick={() => handleEmailSent()}
        className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
      >
        Verify You Email Now!!!
      </Button>
    </div>
  );
};

export default VerificationButton;
