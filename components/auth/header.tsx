import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

interface HeaderProps {
  label?: string;
}
export const Header = ({ label }: HeaderProps) => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-y-4">
      <h1
        className={cn("text-6xl font-semibold drop-shadow-sm", font.className)}
      >
        Auth
      </h1>
      <p className="text-sm">{label}</p>
    </div>
  );
};
