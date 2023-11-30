import { getAllCommentsByBlogId } from "@/lib/actions/comment.action";
import CommentCard from "../cards/CommentCard";

interface Props {
  blogId: string;
  userId: string;
  mongoUser: any;
}
const ShowComments = async ({ blogId, userId, mongoUser }: Props) => {
  const blogid = JSON.parse(blogId);
  const res = await getAllCommentsByBlogId({ blogId: blogid });


  return (
    <div>
      
    {  res.comments.length > 0 && (
        res.comments.map((comment: any) => (
          <CommentCard 
          key={comment._id}
          id={JSON.stringify(comment._id)}
          author={comment.author}
          content={comment.content}
          createdAt={comment.createdAt}
          upvotes={comment.upvotes}
          downvotes={comment.downvotes}
          replies={comment?.replyTo?.length}
          userId={userId}
          blogId={blogid}
          mongoUser={mongoUser}
          />
       ) )
      )}
       
    </div>
  );
};

export default ShowComments;
