"use client";
import React, { useState } from "react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import useMediaQuery from "@/hooks/useMediaQuery";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DeleteAccountSchema } from "@/lib/validations";
import { toast } from "../ui/use-toast";
import { deleteUser } from "@/lib/actions/user.action";

export function DeleteButton() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="destructive" className="mt-5 bg-red-500 text-white">
            Delete Account
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-red-500"> Delete Account</DialogTitle>
            <DialogDescription className="text-dark400_light900">
              Please type your password to confirm account deletion.
            </DialogDescription>
          </DialogHeader>
          <DeleteForm />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="destructive" className="mt-5 bg-red-500 text-white">
          Delete Account
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left ">
          <DrawerTitle className="text-red-500"> Delete Account</DrawerTitle>
          <DrawerDescription className=" text-light-700">
            Please type your password to confirm account deletion.
          </DrawerDescription>
        </DrawerHeader>
        <DeleteForm className="px-4" />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline" className="bg-light-700">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function DeleteForm({ className }: React.ComponentProps<"form">) {
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof DeleteAccountSchema>>({
    resolver: zodResolver(DeleteAccountSchema),
    defaultValues: {
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof DeleteAccountSchema>) {
    try {
      setLoading(true);
      await deleteUser({
        password: values.password,
      }).then((res) => {
        if (res.error) {
          toast({
            title: "Failed",
            description: res.error,
            variant: "destructive",
          });
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
        className={cn("grid items-start gap-4", className)}
      >
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Password
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="******"
                  type="password"
                  {...field}
                  className="text-dark300_light700 background-light800_dark300 "
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={loading}
          className=" mb-2 rounded-lg bg-red-500  text-white "
        >
          Delete Account
        </Button>
      </form>
    </Form>
  );
}
