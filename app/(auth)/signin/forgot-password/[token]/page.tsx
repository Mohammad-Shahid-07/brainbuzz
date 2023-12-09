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
import {  useEffect, useState } from "react";

import Link from "next/link";
import { ForgotPasswordSchema } from "@/lib/validations";
import {
  resetPassword,
  verifyResetPasswordToken,
} from "@/lib/actions/user.action";
interface Props {
  params: {
    token: string;
  };
}
const ForgotPassword = ({ params }: Props) => {
  const token = params?.token;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false);
  // 1. Define your form.
  const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      password: "",
    },
  });
  useEffect(() => {
    verifyResetPasswordToken(token).then((res) => {
      setIsTokenValid(true);
    });
  }, [token]);

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof ForgotPasswordSchema>) {
    try {
      setLoading(true);
      await resetPassword({ token, password: values.password });
      router.push("/signin");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  return isTokenValid ? (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="form-bg m-16 mx-auto  flex max-w-lg flex-col gap-5 p-10 text-light-700  shadow-white"
      >
        <h1 className="h1-bold text-light-800 ">Reset Password</h1>

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

        <Link href="/signin" className="text-white">
          Go Back
        </Link>

        <Button
          type="submit"
          disabled={loading}
          className=" mb-2  w-full rounded-lg bg-primary-500/90 px-5 py-2.5 text-center text-sm font-medium text-light-850 hover:shadow-primary-500/30"
        >
          Continue
        </Button>
      </form>
    </Form>
  ) : (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-5xl font-black text-primary-500">Invalid token</h1>
      <Link
        href="signin/forgot-password"
        className="text-3xl font-black text-red-500"
      >
        Please Try Again
      </Link>
    </div>
  );
};
export default ForgotPassword;
