"use client";
import { useSearchParams } from "next/navigation";
import Loader from "../Loader";
import { CardWrapper } from "./CardWrapper";
import { useCallback, useEffect, useState } from "react";
import { verifyToken } from "@/lib/actions/auth.action";
import { FormSuccess } from "../Form-Sucess";
import { FormError } from "../Form-Error";
import { toast } from "../ui/use-toast";

const VerifyEmailForm = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const onSubmit = useCallback(() => {
    if (success || error) return;
    if (!token) {
      setError("No token provided");
      return;
    }
    verifyToken(token)
      .then((res) => {
        if (res?.error) {
          setError(res?.error);
        } else {
          setSuccess(res?.success!);
          toast({
            title: "Success",
            description: "Please login to continue",
            variant: "success",
          });
        }
      })
      .catch((error) => {
        setError("Something went wrong" + error);
      });
  }, [token, success, error]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);
  return (
    <CardWrapper
      headerLabel="Verifying your email address"
      BackButtonLabel="Back to login"
      BackButtonHref="/login"
    >
      <div className="flex w-full items-center justify-center">
        {!success && !error && <Loader size="150px" color="orange" />}
        <FormSuccess message={success} />

        {!success && <FormError message={error} />}
      </div>
    </CardWrapper>
  );
};

export default VerifyEmailForm;
