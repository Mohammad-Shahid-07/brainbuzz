"use client";
import Prism from "prismjs";
import parse from "html-react-parser";
import katex from "katex";
import "katex/dist/katex.min.css";
import { useEffect } from "react";

// Language Components

import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-aspnet";
import "prismjs/components/prism-sass";
import "prismjs/components/prism-css";
// Prism CSS Theme
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-solidity";
import "prismjs/components/prism-json";
import "prismjs/components/prism-dart";
import "prismjs/components/prism-ruby";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-r";
import "prismjs/components/prism-kotlin";
import "prismjs/components/prism-go";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-mongodb";

// Prism Line Numbers Plugin
import "prismjs/plugins/line-numbers/prism-line-numbers.js";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";

interface Props {
  data: string;
}

const ParseHTML = ({ data }: Props) => {
  useEffect(() => {
    Prism.highlightAll();
    renderMathEquations();
  }, [data]);

  const renderMathEquations = () => {
    const mathRegex = /\$\$(.*?)\$\$|\\\[(.*?)\\\]/g;

    const mathElements = data.match(mathRegex);

    if (mathElements) {
      mathElements.forEach((equation) => {
        const element = document.createElement("div");
        try {
          katex.render(equation, element, {
            displayMode: equation.startsWith("\\["),
          });
          data = data.replace(equation, element.innerHTML);
        } catch (error) {
          console.error(`Error rendering equation: ${equation}`, error);
        }
      });
    }
  };

  return (
    <>
      <div className={`text-dark200_light900 markdown w-full `}>
        {parse(data)}
      </div>
    </>
  );
};

export default ParseHTML;
