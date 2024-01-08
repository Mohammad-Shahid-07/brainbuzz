import BlogsCard from "@/components/cards/BlogsCard";
import HomeFilters from "@/components/home/HomeFilters";
import Filter from "@/components/shared/Filter";
import NoResults from "@/components/shared/NoResults";
import Pagination from "@/components/shared/Pagination";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";

import { HomePageFilters } from "@/constants/filters";
import { getAllBlogs } from "@/lib/actions/blog.action";
import { SearchParamsProps } from "@/types";

export default async function Home({ searchParams }: SearchParamsProps) {
  const res = await getAllBlogs({
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page: searchParams.page ? +searchParams.page : 1,
  });

  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center ">
        <h1 className="h1-bold text-dark100_light900 ">All Blogs</h1>
        {/* <Link href="/blogs/create" className="flex justify-end max-sm:w-full ">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
            Create A Blog
          </Button>
        </Link> */}
      </div>
      <div className="mt-11 flex  justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/blogs"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for a blog"
          otherClasses="flex-1"
        />

        <Filter
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </div>
      <HomeFilters />
      <div className="mt-10 flex w-full flex-col gap-6">
        {res?.blogs.length > 0 ? (
          res?.blogs.map((blog: any) => (
            <BlogsCard
              key={blog._id}
              image={blog.image}
              title={blog.title}
              description={blog.description}
              tags={blog.tags}
              author={blog.author}
              upvotes={blog.upvotes}
              views={blog.views}
              slug={blog.slug}
              comments={blog.comments}
              createdAt={blog.createdAt}
            />
          ))
        ) : (
          <NoResults
            title="There's no Blogs to show"
            discription="There are no blogs to show right now. Please check back later."
            link="/"
            linkText="Go To Home"
          />
        )}
      </div>

      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={res?.isNext}
        />
      </div>
    </>
  );
}
