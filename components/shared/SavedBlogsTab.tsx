import { SearchParamsProps } from "@/types";
import Pagination from "./Pagination";
import BlogsCard from "../cards/BlogsCard";
import { getSavedBlogs } from "@/lib/actions/blog.action";
import NoResults from "./NoResults";

interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string;
}
const SavedBlogsTab = async ({ searchParams, userId, clerkId }: Props) => {
  const res = await getSavedBlogs({
    clerkId: clerkId || "",
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page: searchParams.page ? +searchParams.page : 1,
  });
  return (
    <>
      {res?.blogs.length > 0 ? (
        res?.blogs.map((blog: any) => (
          <BlogsCard
            key={blog._id}
            clerkId={clerkId}
            title={blog.title}
            tags={blog.tags}
            author={blog.author}
            upvotes={blog.upvotes}
            views={blog.views}
            slug={blog.slug}
            comments={blog.comments}
            image={blog.image}
            description={blog.description}
            createdAt={blog.createdAt}
          />
        ))
      ) : (
        <NoResults
          title="You haven't saved any blogs yet"
          discription="Save blogs to read them later"
          link="/blogs"
          linkText="Explore Blogs"
        />
      )}
      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={res?.isNext}
        />
      </div>
    </>
  );
};

export default SavedBlogsTab;
