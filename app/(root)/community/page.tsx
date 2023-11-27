import UserCard from "@/components/cards/UserCard";
import Filters from "@/components/shared/Filter";
import Pagination from "@/components/shared/Pagination";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { UserFilters } from "@/constants/filters";
import { getAllUsers } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import Link from "next/link";

import React from "react";

const Page = async ( {searchParams}: SearchParamsProps) => {
  const res = await getAllUsers({ 
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page: searchParams.page ?  +searchParams.page : 1, 
  });

   
     
     

  return (
    <>
      <div className="flex w-full  flex-col gap-4  ">
        <h1 className="h1-bold text-dark100_light900 ">All Users</h1>
        <div className="mt-11 flex gap-5  max-md:flex-col ">
          <LocalSearchbar
            route="/community"
            iconPosition="left"
            imgSrc="/assets/icons/search.svg"
            placeholder="Search for amazing minds..."
            otherClasses="flex"
          />

          <Filters
            filters={UserFilters}
            otherClasses="min-h-[56px] sm:min-w-[70px]"
          />
        </div>
      </div>
      <section className="mt-12 flex flex-wrap gap-4">
        {res.users.length > 0 ? (
          res.users.map((user) => <UserCard key={user._id} user={user} />)
        ) : (
          <div className="paragraph-regular text-dark200_light800 mx-auto max-w-4xl text-center">
            <p>No Users Yet</p>
            <Link href="/sing-up" className="mt-2 font-bold text-accent-blue">
              Be the First to Join
            </Link>
          </div>
        )}
      </section>
      <div className="mt-10">
        <Pagination
        pageNumber={searchParams?.page? +searchParams.page : 1}
        isNext={res.isNext}
        />
      </div>
    </>
  );
};

export default Page;
