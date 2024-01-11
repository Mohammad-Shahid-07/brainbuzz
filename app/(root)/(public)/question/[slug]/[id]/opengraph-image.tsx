/* eslint-disable react/no-unescaped-entities */
// opengraph-image.tsx

import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt = "Tags Image";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

// Image generation
interface Props {
  params: {
    id: string;
    slug: string;
  };
}
export default async function DynamicImage({ params }: Props) {
  function slugToCamelCaseWithSpaces(slug: string): string {
    return slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  const camelCaseString: string = slugToCamelCaseWithSpaces(params?.slug);

  return new ImageResponse(
    (
      <div tw="relative flex flex-col bg-[#13121C] w-full h-full justify-start">
        <h1 tw="mx-auto mt-10 font-sans text-white text-4xl">Brain Buzz </h1>
        <span tw="absolute right-0 top--1/2">
          {" "}
          <svg
            width="607"
            height="630"
            viewBox="0 0 607 630"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g filter="url(#filter0_f_424_97)">
              <circle cx="843.218" cy="-84.7819" r="338.218" fill="#A35BFF" />
            </g>
            <defs>
              <filter
                id="filter0_f_424_97"
                x="0.687134"
                y="-927.313"
                width="1685.06"
                height="1685.06"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
              >
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="BackgroundImageFix"
                  result="shape"
                />
                <feGaussianBlur
                  stdDeviation="252.156"
                  result="effect1_foregroundBlur_424_97"
                />
              </filter>
            </defs>
          </svg>
        </span>
        <span tw="absolute">
          {" "}
          <svg
            width="649"
            height="630"
            viewBox="0 0 649 630"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g filter="url(#filter0_f_418_50)">
              <circle cx="-193.782" cy="365.218" r="338.218" fill="#4557F6" />
            </g>
            <defs>
              <filter
                id="filter0_f_418_50"
                x="-1036.31"
                y="-477.313"
                width="1685.06"
                height="1685.06"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
              >
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="BackgroundImageFix"
                  result="shape"
                />
                <feGaussianBlur
                  stdDeviation="252.156"
                  result="effect1_foregroundBlur_418_50"
                />
              </filter>
            </defs>
          </svg>
        </span>

        <div tw="flex flex-col mb-10 p-10 text-center min-h-[60vh] justify-center items-center">
          <h1 tw="flex-1 mr-auto mt-3 font-sans text-red-500 text-5xl">
            Do You Know ?
          </h1>
          <h1 tw="text-white text-5xl">{camelCaseString}</h1>
          <a
            href="#"
            tw="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full inline-block transition duration-300 mt-4"
          >
            Join the Dialogue
          </a>
          <p tw="text-lg text-gray-500 mt-4">
            Thoughts Unleashed - Be a Part of Conversations!
          </p>
        </div>
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported opengraph-image
      // size config to also set the ImageResponse's width and height.
      ...size,
    },
  );
}
