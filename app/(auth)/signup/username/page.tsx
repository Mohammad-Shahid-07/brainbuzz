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
import { addUsername } from "@/lib/actions/user.action";
import { toast } from "@/components/ui/use-toast";

const Signup = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  // 1. Define your form.
  const form = useForm<z.infer<typeof AddUsernameSchema>>({
    resolver: zodResolver(AddUsernameSchema),
    defaultValues: {
      username: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof AddUsernameSchema>) {
    try {
      setLoading(true);
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
          description: "Username added successfully.",
        });
      });
      router.push("/");
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
        className="form-bg m-16 mx-auto  flex max-w-lg flex-col gap-5 p-10 text-light-700  shadow-white"
      >
        <h1 className="h1-bold text-light-800 ">Sign Up</h1>

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  className="form-input"
                  placeholder="@username"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={loading}
          className=" mb-2  w-full rounded-lg bg-primary-500/90 px-5 py-2.5 text-center text-sm font-medium text-light-850 hover:shadow-primary-500/30"
        >
          continue
        </Button>
      </form>
    </Form>
  );
};
export default Signup;
