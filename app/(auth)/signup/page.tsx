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
import { usePathname } from "next/navigation";
// import { createUser } from "@/lib/action/user.action";
import { signIn } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { UserSchema } from "@/lib/validations";
import { createUser } from "@/lib/actions/user.action";

const Signup = () => {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  // 1. Define your form.
  const form = useForm<z.infer<typeof UserSchema>>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof UserSchema>) {
    try {
      setLoading(true);
      await createUser({
        name: values.name,
        username: values.username,
        email: values.email,
        password: values.password,
        path: pathname,
      });
      
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
        <div className=" px-6 sm:px-0">
          <button
            type="button"
            onClick={() => {
              signIn("google", { callbackUrl: "/signup/username" });
            }}
            className=" mb-2 flex w-full items-center justify-between rounded-lg bg-light-850 px-5 py-2.5 text-center text-sm font-medium text-dark-400 hover:shadow-light-200 focus:outline-none focus:ring-4 focus:ring-light-400/50"
          >
            <Image
              src="./assets/icons/google.svg"
              width={25}
              height={20}
              alt="google"
            />
            Sign up with Google<div></div>
          </button>
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  className="form-input"
                  placeholder="your name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>username</FormLabel>
              <FormControl>
                <Input
                  className="form-input"
                  placeholder="@youusername"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  className="form-input"
                  placeholder="youremail@email.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  className="form-input"
                  placeholder="********"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <span className="text-light-400">
          Already have an account?{" "}
          <Link href="/signup" className="text-primary-500 hover:text-blue-500">
            Sign in
          </Link>
        </span>

        <Button
          type="submit"
          disabled={loading}
          className=" mb-2  w-full rounded-lg bg-primary-500/90 px-5 py-2.5 text-center text-sm font-medium text-light-850 hover:shadow-primary-500/30"
        >
          Sign up
        </Button>
        <p className="text-light-500 ">
          By clicking on Sign up, you agree to our Terms of service and Privacy
          policy.
        </p>
      </form>
    </Form>
  );
};
export default Signup;
