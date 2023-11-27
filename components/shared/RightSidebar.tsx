import Image from "next/image";
import Link from "next/link";
import React from "react";

import RenderTags from "./RenderTags";
import { getHotQuestions } from "@/lib/actions/question.action";
import { getHotTags } from "@/lib/actions/tag.actions";

const RightSidebar = async() => {
  const hotQuestions = await getHotQuestions()

  const hotTags = await getHotTags()
  
  
  

  

  // Feel free to customize and add more tags based on the technologies and skills you use in your projects!

  return (
    <section className="background-light900_dark200 light-border custom-scrollbar sticky right-0 top-0 mt-16  flex h-screen max-w-sm  flex-col  gap-10 overflow-y-auto  border-r p-6 pt-36 shadow-light-300 dark:shadow-none  max-lg:hidden   sm:pt-12">
      <div>
        <h3 className="h3-semibold text-dark200_light900">Top Questions</h3>
        <div className="mt-7 flex w-full  flex-col ">
          {hotQuestions.map((question) => (
            <Link href={`/question/${question.slug}/${question._id}`}
              className="mt-7 flex w-full justify-between gap-3 "
              key={question._id}
            >
              <p className="body-medium  text-dark500_light700">
                {question.title}
              </p>
              <Image
                src="assets/icons/chevron-right.svg"
                alt="arrow"
                width={22}
                height={22}
                className="invert-colors"
              />
            </Link >
          ))}
        </div>
      </div>
      <div className="mt-16">
        <h3 className="h3-semibold text-dark200_light900">Popular Tags </h3>
        {hotTags.map((tag) => (
         <RenderTags key={tag._id} name={tag.name} id={tag._id} totalQuestions={tag.totalQuestions} showCount  />
        ))}
      </div>
    </section>
  );
};

export default RightSidebar;
