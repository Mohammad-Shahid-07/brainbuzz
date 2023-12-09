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

import { useState } from "react";

import Link from "next/link";
import { ForgotPasswordRequestSchema } from "@/lib/validations";
import { sendPasswordResetEmail } from "@/lib/actions/user.action";

const ForgotPassword = () => {
 
  const [loading, setLoading] = useState(false);
  // 1. Define your form.
  const form = useForm<z.infer<typeof ForgotPasswordRequestSchema>>({
    resolver: zodResolver(ForgotPasswordRequestSchema),
    defaultValues: {
      email: "",
    },
  });

  // 2. Define a submit handler.
 async function onSubmit(values: z.infer<typeof ForgotPasswordRequestSchema>) {
    try {
      setLoading(true);
      await sendPasswordResetEmail(values.email);
      alert("Check your email for the reset link.");
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
        <h1 className="h1-bold text-light-800 ">Reset Password</h1>

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

        <Link
          href="/signin"
          className="text-white"
        >
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
  );
};
export default ForgotPassword;
