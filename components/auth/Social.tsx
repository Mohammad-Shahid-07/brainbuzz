import Image from "next/image";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";

import { useSearchParams } from "next/navigation";

export const Social = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const handleOauth = (provider: "google" | "github") => {
    signIn(provider, {
      callbackUrl: callbackUrl || "/",
    });
  };

  return (
    <div className="flex w-full items-center gap-x-2">
      <Button
        className="w-full "
        variant="outline"
        size="lg"
        onClick={() => handleOauth("google")}
      >
        <Image
          src="/assets/icons/google.svg"
          width={30}
          height={30}
          alt="google"
          className="h-8 w-8"
        />
      </Button>
      <Button
        className="w-full "
        variant="outline"
        size="lg"
        onClick={() => handleOauth("github")}
      >
        <Image
          src="/assets/icons/github.svg"
          width={20}
          height={20}
          alt="Github"
          className="h-8 w-8"
        />
      </Button>
    </div>
  );
};
