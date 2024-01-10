"use client";
import React, { useState, useTransition } from "react";
import { CardWrapper } from "./CardWrapper";
import { useForm } from "react-hook-form";

import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { FormError } from "../Form-Error";
import { FormSuccess } from "../Form-Sucess";
import { LoginUser } from "@/lib/actions/auth.action";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { LoginSchema } from "@/lib/validations";

export const LoginForm = () => {
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email aleady in use. Please login with diffrent Provider!"
      : "";
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof LoginSchema>) {
    startTransition(() => {
      LoginUser(values)
        .then((res) => {
          if (res?.error) {
            form.reset();
            setError(res?.error);
          }
          if (res?.success) {
            form.reset();
            setSuccess(res?.success!);
          }
          if (res?.twoFactor) {
            setShowTwoFactor(true);
          }
        })
        .catch((err) => {
          setError(err?.message);
        });
    });
  }

  return (
    <CardWrapper
      headerLabel="Welcome back!"
      BackButtonLabel="Don't have an account?"
      BackButtonHref="/register"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-6">
            {!showTwoFactor ? (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="jogn.doe@example.com"
                          type="email"
                          disabled={isPending}
                          {...field}
                          className="border-none bg-dark-400  text-light-400 focus:ring-1"
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
                          placeholder="password"
                          disabled={isPending}
                          type="password"
                          className="border-none bg-dark-400  text-light-400 focus:ring-1"
                          {...field}
                        />
                      </FormControl>
                      <Button
                        variant="link"
                        asChild
                        className="px-0 font-normal text-light-500"
                        disabled={isPending}
                      >
                        <Link href="/reset">Forgot Password?</Link>
                      </Button>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            ) : (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123456"
                        type="number"
                        disabled={isPending}
                        className="border-none bg-dark-400  text-light-400 focus:ring-1"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
          <FormError message={error || urlError} />
          <FormSuccess message={success} />
          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-primary-500 shadow-light-200 hover:bg-primary-500/75"
          >
            {showTwoFactor ? "Verify" : "Login"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
