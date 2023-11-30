import { SearchParamsProps } from "@/types";
import Pagination from "./Pagination";
import BlogsCard from "../cards/BlogsCard";
import { getSavedBlogs } from "@/lib/actions/blog.action";

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
      {res?.blogs.map((question: any) => (
        <BlogsCard
          key={question._id}
          clerkId={clerkId}
          title={question.title}
          tags={question.tags}
          author={question.author}
          upvotes={question.upvotes}
          views={question.views}
          slug={question.slug}
          comments={question.comments}
          image={question.image}
          description={question.description}
          createdAt={question.createdAt}
        />
      ))}
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
