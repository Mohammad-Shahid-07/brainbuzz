"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { AddUsernameSchema } from "@/lib/validations";
import { addName, addUsername } from "@/lib/actions/user.action";
import { toast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
interface Props {
  name?: string;
  username?: string;
  type?: string;
}
const NameUser = ({ name, username, type }: Props) => {
  const { data: session, update } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  // 1. Define your form.
  const form = useForm<z.infer<typeof AddUsernameSchema>>({
    resolver: zodResolver(AddUsernameSchema),
    defaultValues: {
      username: type === "Username" ? username : name,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof AddUsernameSchema>) {
    try {
      setLoading(true);
      if (type === "Username") {
        const regex = /^[a-zA-Z][a-zA-Z0-9_]{2,20}$/;
        if (!regex.test(values.username)) {
          // Handle the error (e.g., display a message to the user)
          return toast({
            title: "Invalid Username",
            description:
              "Please use only letters, numbers, and underscores. It should start with a letter and be between 3 to 20 characters long.",
          });
        }
        await addUsername({
          username: values.username,
          path: pathname,
        }).then(() => {
          toast({
            title: "Success",
            description: "Username updated successfully.",
          });
        });
        await update({
          ...session,
          user: {
            ...session?.user,
            username : values.username,
          },
        })
        router.back();
      } else if (type === "Name") {
        await addName({
          name: values.username,
          path: pathname,
        }).then(() => {
          toast({
            title: "Success",
            description: "Name Updated successfully.",
          });
        });

        await update({
          ...session,
          user: {
            ...session?.user,
            name: values.username,
          },
        })
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-5 flex w-full flex-col gap-9 "
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                {type}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={type}
                  type="text"
                  {...field}
                  className="no-focus paragraph-regular text-dark300_light700 background-light800_dark300 border"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className=" flex justify-end">
          <Button
            type="submit"
            disabled={loading}
            className=" btn primary-gradient mb-2 rounded-lg px-5 py-2.5 text-center text-sm font-medium text-light-850 hover:text-light-500"
          >
            Update
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default NameUser;
