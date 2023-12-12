"use client";
import React, { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { QuestionsSchema } from "@/lib/validations";
import { Badge } from "../ui/badge";

import { createQuestion, editQuestion } from "@/lib/actions/question.action";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "@/context/ThemeProvider";
import Image from "next/image";
import { toast } from "../ui/use-toast";
import { createBlog } from "@/lib/actions/blog.action";
import { UploadButton } from "@/lib/uploadthig";

type Props = {
  mongoUserId: string;
  type?: string;
  questionDetails?: string;
  isVerified?: boolean;
};
const Question = ({
  mongoUserId,
  type,
  questionDetails,
  isVerified,
}: Props) => {
  const editorRef = useRef(null);
  const { mode } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const parsedQuestionDetails =
    type === "Edit" && JSON.parse(questionDetails || "");

  const groupedTags =
    type === "Edit" && parsedQuestionDetails.tags.map((tag: any) => tag.name);

  const form = useForm<z.infer<typeof QuestionsSchema>>({
    resolver: zodResolver(QuestionsSchema),
    defaultValues: {
      title: parsedQuestionDetails.title || "",
      description: parsedQuestionDetails.description || "",
      explanation: parsedQuestionDetails.content || "",
      tags: groupedTags || [],
      image: "",
    },
  });

  const handleKeydown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: any,
  ) => {
    if (e.key === "Enter" && field.name === "tags") {
      e.preventDefault();

      const tagInput = e.target as HTMLInputElement;
      const tagVal = tagInput.value.trim();

      if (tagVal !== "") {
        if (tagVal.length > 15) {
          return form.setError("tags", {
            type: "required",
            message: "Tag must be less than 15 characters",
          });
        }

        if (!field.value.includes(tagVal as never)) {
          form.setValue("tags", [...field.value, tagVal]);
          tagInput.value = "";
          form.clearErrors("tags");
        }
      } else {
        form.trigger();
      }
    }
  };
  const handleTagRemove = (tag: string, field: any) => {
    const filteredTags = field.value.filter((t: string) => t !== tag);
    form.setValue("tags", filteredTags);
  };

  if (isSubmitting) {
    toast({
      title: `Your Question is Being ${
        type === "Edit" ? "Edited" : "Posted"
      }  `,
    });
  }

  const handleClientUploadComplete = (res: any) => {
    // Do something with the response, e.g., update the form data

    form.setValue("image", res[0].url);

    toast({
      title: "Image Upload Completed",
    });
  };

  // New function to handle client upload error
  const handleUploadError = (error: any) => {
    // Handle the error, e.g., show a toast message
    toast({
      title: `Image Upload Error: ${error.message}`,
      variant: "destructive",
    });
  };
  // 2. Define a submit handler.

  async function onSubmit(values: z.infer<typeof QuestionsSchema>) {
    setIsSubmitting(true);

    try {
      if (isVerified === false) {
        toast({
          title: "Your email is not verified",
          description: "Please verify your email first.",
          variant: "destructive",
        });
        return;
      }
      if (type === "Edit") {
        const slug = await editQuestion({
          questionId: parsedQuestionDetails._id,
          title: values.title,
          content: values.explanation,
          path: pathname,
        });
        router.push(`/question/${slug}/${parsedQuestionDetails._id}`);
      } else if (type === "Blog") {
        await createBlog({
          title: values.title,
          description: values.description!,
          content: values.explanation,
          tags: values.tags,
          image: values.image!,
          author: JSON.parse(mongoUserId),
          path: pathname,
        });
        router.push("/blogs");
      } else if (type === "Question") {
        await createQuestion({
          title: values.title,
          content: values.explanation,
          tags: values.tags,
          author: JSON.parse(mongoUserId),
          path: pathname,
        });

        router.push("/");
      }
    } catch (error: any) {
      console.log(error);
      toast({
        title: `Error ${type === "Edit" ? "Editing" : "Posting"} Question`,
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <div>
      {" "}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-10 space-y-8"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel className="paragraph-semibold text-dark400_light800">
                  Question Title <span className="text-primary-500">*</span>{" "}
                </FormLabel>
                <FormControl className="mt-3.5">
                  <Input
                    className="no-focus paragraph-regular text-dark400_light800 background-light700_dark300 light-border-2 min-h-[56px] border "
                    {...field}
                  />
                </FormControl>
                <FormDescription className="body-regular mt-2.5 text-light-500">
                  Be specific and imagine you&apos;re asking a question to
                  another person
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          {type === "Blog" && (
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="flex w-full flex-col">
                  <FormLabel className="paragraph-semibold text-dark400_light800">
                    Description of Your Blog{" "}
                    <span className="text-primary-500">*</span>{" "}
                  </FormLabel>
                  <FormControl className="mt-3.5">
                    <Input
                      className="no-focus paragraph-regular text-dark400_light800 background-light700_dark300 light-border-2 min-h-[56px] border "
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="body-regular mt-2.5 text-light-500">
                    Summerize your blog in 2-3 lines
                  </FormDescription>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="explanation"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormLabel className="paragraph-semibold text-dark400_light800">
                  Detailed Explanation of your problem{" "}
                  <span className="text-primary-500">*</span>{" "}
                </FormLabel>
                <FormControl className="mt-3.5">
                  <Editor
                    apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                    onInit={(evt, editor) => {
                      // @ts-ignore
                      editorRef.current = editor;
                    }}
                    onBlur={field.onBlur}
                    onEditorChange={(content, editor) => {
                      field.onChange(content);
                    }}
                    initialValue={parsedQuestionDetails.content || ""}
                    init={{
                      height: 350,
                      menubar: true,
                      plugins: [
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "image",
                        "charmap",
                        "preview",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "codesample",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                        "table",
                      ],
                      toolbar:
                        "undo redo  | " +
                        "codesample | bold italic forecolor | alignleft aligncenter |" +
                        "alignright alignjustify | bullist numlist  | ",
                      content_style:
                        "body { font-family:Inter; font-size:16px }",
                      skin: mode === "dark" ? "oxide-dark" : "oxide",
                      content_css: mode === "dark" ? "dark" : "light",
                    }}
                  />
                </FormControl>
                <FormDescription className="body-regular mt-2.5 text-light-500">
                  Introduce the problem and expand on what you put in the title.
                  Minimum 20 characters.
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel className="paragraph-semibold text-dark400_light800">
                  Tags <span className="text-primary-500">*</span>
                </FormLabel>
                <FormControl className="mt-3.5">
                  <>
                    <Input
                      className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                      onKeyDown={(e) => handleKeydown(e, field)}
                      placeholder="Add tags..."
                      disabled={type === "Edit"}
                    />

                    {field.value.length > 0 && (
                      <div className="flex-start mt-2.5 gap-2.5">
                        {field.value.map((tag: any) => (
                          <Badge
                            key={tag}
                            onClick={() =>
                              type !== "Edit" && handleTagRemove(tag, field)
                            }
                            className="subtle-medium background-light800_dark300 text-light400_light500 flex items-center justify-center gap-2 rounded-md border-none px-4 py-2 capitalize"
                          >
                            {tag}{" "}
                            {type !== "Edit" && (
                              <Image
                                src="/assets/icons/close.svg"
                                alt="Close"
                                width={12}
                                height={12}
                                className="cursor-pointer object-contain invert-0 dark:invert"
                              />
                            )}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </>
                </FormControl>
                <FormDescription className="body-regular mt-2.5 text-light-500">
                  Add up to 3 tags to describe what your question is about. You
                  need to press enter to add a tag.
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          {type === "Blog" && (
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={handleClientUploadComplete}
              onUploadError={handleUploadError}
            />
          )}
          <Button
            type="submit"
            className="primary-gradient !text-light-900"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                {type === "Edit" ? "Editing" : "Posting"}{" "}
                {type === "Blog" ? "Blog..." : "Question..."}
              </>
            ) : (
              <>
                {type === "Edit" ? "Edit" : "Ask a"}{" "}
                {type === "Blog" ? "Blog" : "Question"}
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Question;
