"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";

import { useEffect, useState } from "react";
import { TwoFactorTogglerSchema } from "@/lib/validations";
import { toast } from "@/components/ui/use-toast";
import { TwoFactorSystem } from "@/lib/actions/user.action";
import { usePathname } from "next/navigation";

interface Props {
  user: string;
}
const TwoFactorToggler = ({ user }: Props) => {
  const [loading, setLoading] = useState(false);
  const [initialValuesReady, setInitialValuesReady] = useState(false);
  const pathname = usePathname();
  const parsedUser = JSON.parse(user);

  // 1. Define your form.
  const form = useForm<z.infer<typeof TwoFactorTogglerSchema>>({
    resolver: zodResolver(TwoFactorTogglerSchema),
    defaultValues: {
      isTwoFactorEnabled: parsedUser?.TwoFactorEnabled ?? false,
    },
  });
  useEffect(() => {
    form.setValue("isTwoFactorEnabled", parsedUser?.twoFactorEnabled || false);
    const timeoutId = setTimeout(() => {
      setInitialValuesReady(true);
    }, 1000); // 1000 milliseconds = 1 second

    return () => {
      // Clear the timeout if the component is unmounted before the delay is complete
      clearTimeout(timeoutId);
    };
  }, []);

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof TwoFactorTogglerSchema>) {
    try {
      setLoading(true);
      if (!initialValuesReady) return;
      const res = await TwoFactorSystem({
        path: pathname,
        isTwoFactorEnabled: values.isTwoFactorEnabled,
      });
      if (res?.error) {
        toast({
          title: "Failed",
          description: res.error,
          variant: "destructive",
        });
      } else if (res?.success) {
        toast({
          title: "Success",
          description: res.success,
        });
      }
    } catch (error: any) {
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
        onChange={form.handleSubmit(onSubmit)}
        className="mt-5 flex w-full flex-col gap-9 "
      >
        <FormField
          control={form.control}
          name="isTwoFactorEnabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border border-light-400 p-3 shadow-sm dark:border-light-900">
              <div className="space-y-0.5">
                <FormLabel className="text-dark100_light900">
                  Two Factor Authentication
                </FormLabel>
                <FormDescription className="text-dark400_light700">
                  Enable two factor authentication for your account
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  disabled={loading}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
export default TwoFactorToggler;
