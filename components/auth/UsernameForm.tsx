"use client";
import React, { useState, useTransition } from "react";
import { CardWrapper } from "./CardWrapper";
import { useForm } from "react-hook-form";
import { AddUsernameSchema } from "@/lib/validations";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { addUsername } from "@/lib/actions/user.action";
import { usePathname } from "next/navigation";

export const UsernameForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const form = useForm<z.infer<typeof AddUsernameSchema>>({
    resolver: zodResolver(AddUsernameSchema),
    defaultValues: {
      username: "",
    },
  });

  async function onSubmit(values: z.infer<typeof AddUsernameSchema>) {
    startTransition(() => {
      const regex = /^[a-zA-Z][a-zA-Z0-9_]{2,20}$/;
      if (!regex.test(values.username)) {
        // Handle the error (e.g., display a message to the user)
        setError(
          "Please use only letters, numbers, and underscores. It should start with a letter and be between 3 to 20 characters long.",
        );
      }
      addUsername({
        username: values.username,
        path: pathname,
      }).then((res) => {
        if (res?.error) setError(res.error);
        if (res?.success) setSuccess(res.success);
      });
    });
  }

  return (
    <CardWrapper
      headerLabel="Add Username"
      BackButtonLabel="Back to Login"
      BackButtonHref="/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="@JohnDoe"
                      type="text"
                      className="border-none bg-dark-400  text-light-400 focus:ring-1"
                      {...field}
                      disabled={isPending}
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
            disabled={isPending}
            className="w-full bg-primary-500 shadow-light-200 hover:bg-primary-500/75"
          >
            Add Username
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
