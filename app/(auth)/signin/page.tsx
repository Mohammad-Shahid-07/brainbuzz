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
import { useRouter } from "next/navigation";
// import { createUser } from "@/lib/action/user.action";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { LoginSchema } from "@/lib/validations";
import { toast } from "@/components/ui/use-toast";

const Signin = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  // 1. Define your form.
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof LoginSchema>) {
    setLoading(true);
    try {
      signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      }).then((res: any) => {
        if (res.error) {
          return toast({
            title: res.error,
            description: "Please try again",
            variant: "destructive",
          });
        } else {
          router.push("/");
        }
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
        <h1 className="h1-bold text-light-800 ">Sign in</h1>
        <div className=" px-6 sm:px-0">
          <button
            type="button"
            onClick={() => {
              signIn("google");
            }}
            className=" mb-2 flex w-full items-center justify-between rounded-lg bg-light-850 px-5 py-2.5 text-center text-sm font-medium text-dark-400 hover:shadow-light-200 focus:outline-none focus:ring-4 focus:ring-light-400/50"
          >
            <Image
              src="./assets/icons/google.svg"
              width={25}
              height={20}
              alt="google"
            />
            Login with Google<div></div>
          </button>
        </div>

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

        <Link
          href="/signin/forgot-password"
          className="text-primary-500 hover:text-blue-500"
        >
          Forgot Password?{" "}
        </Link>

        <span className="text-light-400">
          Don&rsquo;t have a account yet?{" "}
          <Link href="/register" className="text-primary-500 hover:text-blue-500">
            Sign up
          </Link>
        </span>

        <Button
          type="submit"
          disabled={loading}
          className=" mb-2  w-full rounded-lg bg-primary-500/90 px-5 py-2.5 text-center text-sm font-medium text-light-850 hover:shadow-primary-500/30"
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
          {!loading && "Sign in"}
        </Button>
      </form>
    </Form>
  );
};
export default Signin;
