/* eslint-disable react/no-unescaped-entities */
// opengraph-image.tsx
import { ParamsProps } from "@/types";
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
export default async function Image({ params }: ParamsProps) {
  return new ImageResponse(
    (
      <div tw="relative   flex flex-col bg-[#13121C] w-full h-full justify-start ">
        <h1 tw="mx-auto mt-10 font-sans text-white">Brain Buzz</h1>
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
        <div tw="flex flex-col mt-10 justify-center items-center">
          <p tw="text-white text-5xl flex items-center ">
            Discover
            <span tw="font-bold text-[#4557F6] px-5 text-7xl">
              {" "}
              @{params.id}'s{" "}
            </span>
            World
          </p>
          <img
            src="https://utfs.io/f/80aece09-8703-484e-8723-b14e4defc52a-zhx551.jpeg"
            alt="image"
            tw="mt-20 rounded-xl  w-3/4"
          />
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
