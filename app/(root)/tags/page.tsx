import Filters from "@/components/shared/Filter";
import NoResults from "@/components/shared/NoResults";
import Pagination from "@/components/shared/Pagination";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { TagFilters } from "@/constants/filters";
import { getAllTags } from "@/lib/actions/tag.actions";
import { SearchParamsProps } from "@/types";

import Link from "next/link";

import React from "react";

const Page = async ({ searchParams }: SearchParamsProps) => {
  const res = await getAllTags({
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page: searchParams.page ? +searchParams.page : 1,
  });

  return (
    <>
      <div className="flex w-full  flex-col gap-4  ">
        <h1 className="h1-bold text-dark100_light900 ">All Users</h1>
        <div className="mt-11 flex gap-5  max-md:flex-col ">
          <LocalSearchbar
            route="/tags"
            iconPosition="left"
            imgSrc="/assets/icons/search.svg"
            placeholder="Search for amazing minds..."
            otherClasses="flex"
          />

          <Filters
            filters={TagFilters}
            otherClasses="min-h-[56px] sm:min-w-[70px]"
          />
        </div>
      </div>
      <section className="mt-12 flex flex-wrap gap-4">
        {res?.tags.length > 0 ? (
          res?.tags.map((tag) => (
            <Link
              href={`/tags/${tag.name}`}
              key={tag._id}
              className="shadow-light100_darknone"
            >
              <article className="background-light900_dark200 light-border flex w-full flex-col rounded-2xl border px-8 py-10 sm:w-[260px]">
                <div className="background-light800_dark400 w-fit rounded-sm px-5 py-1.5">
                  <p className="paragraph-semibold text-dark300_light900">
                    {tag.name}
                  </p>
                </div>
                <p className="small-medium text-dark400_light500 mt-3.5 ">
                  <span className="body-semibold primary-text-gradient mr-2.5 ">
                    {tag.questions.length}+{" "}
                  </span>{" "}
                  <span>Questions</span>
                </p>
              </article>
            </Link>
          ))
        ) : (
          <NoResults
            title="No Tags Yet"
            discription="It seems like no one has asked a question yet."
            link="/ask-question"
            linkText="Ask a Question"
          />
        )}
      </section>
      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={res?.isNext}
        />
      </div>
    </>
  );
};

export default Page;
