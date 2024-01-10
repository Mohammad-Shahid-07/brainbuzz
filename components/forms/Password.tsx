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
import { SetPasswordSchema } from "@/lib/validations";
import { changePass, setNewPass } from "@/lib/actions/user.action";
import { toast } from "@/components/ui/use-toast";
interface Props {
  userId: string;
  type?: string;
}
const Password = ({ userId, type }: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  // 1. Define your form.
  const form = useForm<z.infer<typeof SetPasswordSchema>>({
    resolver: zodResolver(SetPasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SetPasswordSchema>) {
    try {
      setLoading(true);

      if (type === "New Password") {
        if (values.newPassword === values.confirmNewPassword) {
          await setNewPass({
            newPassword: values.newPassword,
            userId,
            path: pathname,
          }).then(() => {
            toast({
              title: "Success",
              description: "Passowrd set successfully.",
            });
          });
          router.back();
        } else {
          toast({
            title: "Failed",
            description: "Password does not match.",
            variant: "destructive",
          });
        }
      } else if (type === "Change Password") {
        if (values.newPassword === values.confirmNewPassword) {
          await changePass({
            oldPassword: values.oldPassword,
            newPassword: values.newPassword,
            userId,
            path: pathname,
          }).then(() => {
            toast({
              title: "Success",
              description: "Password Changed successfully.",
            });
          });
        } else {
          toast({
            title: "Failed",
            description: "Password does not match.",
            variant: "destructive",
          });
        }
      }
    } catch (error: any) {
      console.log(error);
      toast({
        title: "Failed",
        description: error.message,
        variant: "destructive",
      });
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
        {type === "Change Password" && (
          <FormField
            control={form.control}
            name="oldPassword"
            render={({ field }) => (
              <FormItem className="space-y-3.5">
                <FormLabel className="paragraph-semibold text-dark400_light800">
                  Old Password
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Old Password"
                    type="text"
                    {...field}
                    className="no-focus paragraph-regular text-dark300_light700 background-light800_dark300 border"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                New Password
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Type In Your New Password"
                  type="text"
                  {...field}
                  className="no-focus paragraph-regular text-dark300_light700 background-light800_dark300 border"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmNewPassword"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Confirm New Password
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Please Confrim Your Password"
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
export default Password;
