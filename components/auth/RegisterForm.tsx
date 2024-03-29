"use client";
import React, { useState, useTransition } from "react";
import { CardWrapper } from "./CardWrapper";
import { useForm } from "react-hook-form";
import { RegisterSchema } from "@/lib/validations";
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
import { RegisterUser } from "@/lib/actions/auth.action";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "../ui/use-toast";

export const RegisterForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof RegisterSchema>) {
    const regex = /^[a-zA-Z][a-zA-Z0-9_]{2,20}$/;
    if (!regex.test(values.username)) {
      // Handle the error (e.g., display a message to the user)
      return toast({
        title: "Invalid Username",
        description:
          "Please use only letters, numbers, and underscores. It should start with a letter and be between 3 to 20 characters long.",
        variant: "destructive",
      });
    }
    startTransition(() => {
      RegisterUser(values).then((res) => {
        if (res?.error) {
          setError(res?.error);
        } else {
          setSuccess(res?.success);
        }
      });
    });
  }

  return (
    <CardWrapper
      headerLabel="Create an account"
      BackButtonLabel="Already have an account?"
      BackButtonHref="/login"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      disabled={isPending}
                      type="text"
                      className="border-none bg-dark-400  text-light-400 focus:ring-1"
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
                      placeholder="JohnDoe@example.com"
                      disabled={isPending}
                      type="text"
                      className="border-none bg-dark-400  text-light-400 focus:ring-1"
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
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="@JohnDoe"
                      disabled={isPending}
                      type="username"
                      className="border-none bg-dark-400  text-light-400 focus:ring-1"
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
                      placeholder="password"
                      disabled={isPending}
                      type="password"
                      className="border-none bg-dark-400  text-light-400 focus:ring-1"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button
            type="submit"
            className="w-full bg-primary-500 shadow-light-200 hover:bg-primary-500/75"
            disabled={isPending}
          >
            Register
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
