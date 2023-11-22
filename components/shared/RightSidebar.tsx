import Image from "next/image";
import Link from "next/link";
import React from "react";

import RenderTags from "./RenderTags";

const RightSidebar = () => {
  const codingQuestions = [
    { _id: 1,
      question: "Explain the box model in CSS.",
      answer:
        "The box model in CSS comprises content, padding, border, and margin. It defines how these components contribute to the total space an element occupies.",
    },
    {
      _id: 2,
      question:
        "What is the difference between 'let', 'const', and 'var' in JavaScript?",
      answer:
        "'let' and 'const' are block-scoped, while 'var' is function-scoped. 'const' is used for constants, and 'let' is for variables with reassignment.",
    },
    {
      _id: 3,
      question: "What is React and why might you use it?",
      answer:
        "React is a JavaScript library for building user interfaces. It is used for creating reusable UI components, making it easier to manage and update complex UIs.",
    },
    {_id: 4,
      question: "Explain the concept of state in React.",
      answer:
        "State in React is an object that represents the parts of the application that can change. It is managed within a component and can influence what is rendered in the UI.",
    },
    {
      _id: 5,
      question: "How does the 'map' function work in JavaScript?",
      answer:
        "The 'map' function is used to iterate over an array and return a new array with modified elements. It applies a callback function to each element of the array.",
    },
  
    // Add more questions as needed
  ];
  const projectTags = [
    { _id: "1", name: "HTML5", totalQuestions: 10 },
    { _id: "2", name: "CSS3", totalQuestions: 5},
    { _id: "3", name: "JavaScript", totalQuestions: 4 },
    { _id: "4", name: "React", totalQuestions: 2 },
  
    // Add more tags specific to your projects
  ];
  

  

  // Feel free to customize and add more tags based on the technologies and skills you use in your projects!

  return (
    <section className="background-light900_dark200 light-border custom-scrollbar sticky right-0 top-0 mt-16  flex h-screen max-w-sm  flex-col  gap-10 overflow-y-auto  border-r p-6 pt-36 shadow-light-300 dark:shadow-none  max-lg:hidden   sm:pt-12">
      <div>
        <h3 className="h3-semibold text-dark200_light900">Top Questions</h3>
        <div className="mt-7 flex w-full  flex-col ">
          {codingQuestions.map((question) => (
            <Link href={`/questions/${question._id}`}
              className="mt-7 flex w-full justify-between gap-3 "
              key={question.question}
            >
              <p className="body-medium  text-dark500_light700">
                {question.question}
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
        {projectTags.map((tag) => (
         <RenderTags key={tag._id} name={tag.name} id={tag._id} totalQuestions={tag.totalQuestions} showCount  />
        ))}
      </div>
    </section>
  );
};

export default RightSidebar;
