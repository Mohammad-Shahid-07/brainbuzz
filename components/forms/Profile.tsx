"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import { ProfileSchema } from "@/lib/validations";
import { usePathname, useRouter } from "next/navigation";
import { updateUser } from "@/lib/actions/user.action";
interface Props {
  userId: string;
  user: string;
}

const Profile = ({ userId, user }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const parsedUser = JSON.parse(user);

  // 1. Define your form.
  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      portfolioWebsite: parsedUser?.portfolioWebsite || "",
      linkedin: parsedUser?.linkedin || "",
      location: parsedUser?.location || "",
      bio: parsedUser?.bio || "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof ProfileSchema>) {
    setIsSubmitting(true);
    try {
      await updateUser({
        userId,
        updateData: {
          portfolioWebsite: values.portfolioWebsite,
          linkedin: values.linkedin,
          location: values.location,
          bio: values.bio,
        },
        path: pathname,
      });
      router.back();
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mt-5">
      <h3 className="h2-bold text-dark100_light900">More About You </h3>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-5 flex w-full flex-col gap-9 "
        >
          <FormField
            control={form.control}
            name="portfolioWebsite"
            render={({ field }) => (
              <FormItem className="space-y-3.5">
                <FormLabel className="paragraph-semibold text-dark400_light800">
                  Porfoliyo Link
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Porfoliyo Link (Optional)"
                    type="url"
                    {...field}
                    className="no-focus paragraph-regular text-dark300_light700 background-light800_dark300 border"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="linkedin"
            render={({ field }) => (
              <FormItem className="space-y-3.5">
                <FormLabel className="paragraph-semibold text-dark400_light800">
                  linkedin
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="linkedin Link (Optional)"
                    type="url"
                    {...field}
                    className="no-focus paragraph-regular text-dark300_light700 background-light800_dark300 border"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="space-y-3.5">
                <FormLabel className="paragraph-semibold text-dark400_light800">
                  Location
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Where are you from"
                    {...field}
                    className="no-focus paragraph-regular text-dark300_light700 background-light800_dark300 border"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem className="space-y-3.5">
                <FormLabel className="paragraph-semibold text-dark400_light800">
                  Bio <span className="text-primary-500">*</span>{" "}
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Whats special About you"
                    {...field}
                    className="no-focus paragraph-regular text-dark300_light700 background-light800_dark300 border"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mt-7 flex justify-end ">
            <Button
              type="submit"
              className="primary-gradient w-fit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Profile;
