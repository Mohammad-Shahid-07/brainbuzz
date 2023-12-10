"use client";
import { ProfileUrls } from "@/constants";
import { updateUserImage } from "@/lib/actions/user.action";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "../ui/use-toast";
import { useSession } from "next-auth/react";

const ChooseAvatar = () => {
  const [loading, setLoading] = useState(false);
  const { data: session, update } = useSession();
  const path = usePathname();
  const handleImageChange = async (img: string) => {
    try {
      setLoading(true);
      await updateUserImage({ image: img, path });
      await update({
        ...session,
        user: {
          ...session?.user,
          image: `${img}`,
        },
      });

      toast({
        title: "Success",
        description: "Profile picture updated successfully.",
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <div className="mt-10 flex flex-wrap items-center justify-between gap-10 transition-all ">
        {ProfileUrls.map((img) => (
          <div
            key={img}
            className="group relative h-32 w-32 overflow-hidden rounded-full"
          >
            <Image
              src={img}
              className="h-32 w-32 rounded-full transition-transform duration-300 ease-in-out group-hover:scale-110"
              alt="profile"
              width={120}
              height={120}
            />
            <div className="absolute bottom-2  opacity-100 transition-opacity duration-300">
              <button
                className="hover:primary-gradient  w-32
              translate-y-12 rounded-full bg-primary-500 px-5 py-2.5 text-center
              text-sm 
              font-medium text-light-850  transition-all group-hover:translate-y-2"
                onClick={() => {
                  handleImageChange(img);
                }}
                disabled={loading}
              >
                {loading && (
                  <Image
                    src="/assets/icons/loading-fill.svg"
                    alt="check"
                    width={20}
                    height={20}
                    className="mx-auto animate-spin text-center"
                  />
                )}
                {!loading && <p>Choose</p>}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChooseAvatar;
