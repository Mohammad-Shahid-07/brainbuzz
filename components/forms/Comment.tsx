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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { createComment, replyToComment } from "@/lib/actions/comment.action";
const formSchema = z.object({
  comment: z.string().min(2, {
    message: "comment must be at least 2 characters.",
  }),
});

interface Props {
  blogId: string;
  userId: string;
  commentId?: string;
  type?: string;
}
const Comment = ({ blogId, userId, commentId, type }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pathname = usePathname();
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: "",
    },
  });
  console.log({ commentId, type, blogId, userId });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    try {
      if (type === "Reply") {
        await replyToCmment({
          commentId: JSON.parse(commentId),
          author: JSON.parse(userId),
          blog: JSON.parse(blogId),
          content: values.comment,
          path: pathname,
        });
      } else {
        await createComment({
          blog: JSON.parse(blogId),
          author: JSON.parse(userId),
          content: values.comment,
          path: pathname,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-5 ">
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  className="text-dark400_light500 background-light800_dark400 w-full rounded-md border-b border-transparent  p-2 transition  focus:outline-none "
                  placeholder="Add a comment"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-5 flex justify-end">
          <Button
            type="submit"
            className="primary-gradient w-fit text-light-900 sm:w-auto"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Commenting..." : "Comment"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default Comment;
