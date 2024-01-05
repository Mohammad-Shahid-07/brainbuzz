"use client";

import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { BackButton } from "./BackButton";
import { Social } from "./Social";
import { Header } from "./header";

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel?: string;
  BackButtonLabel?: string;
  BackButtonHref: string;
  showSocial?: boolean;
}
export const CardWrapper = ({
  children,
  headerLabel,
  BackButtonLabel,
  BackButtonHref,
  showSocial,
}: CardWrapperProps) => {
  return (
    <Card className="w-[400px] shadow-md">
      <CardHeader>
        <Header label={headerLabel} />
      </CardHeader>
      <CardContent>{children}</CardContent>
      {showSocial && (
        <CardFooter>
          <Social />
        </CardFooter>
      )}
      <CardFooter>
        <BackButton href={BackButtonHref} label={BackButtonLabel} />
      </CardFooter>
    </Card>
  );
};
