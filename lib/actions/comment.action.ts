"use server";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../mongoose";
import Comment from "@/database/comment.model";
import { CommentVoteParams, CreateCommentParams, CreateReplyParams, GetCommentsParams } from "./shared.types";
import Blog from "@/database/blog.model";
import User from "@/database/user.model";
import Interaction from "@/database/interaction.model";

export async function createComment(params: CreateCommentParams) {
  try {
    connectToDatabase();
    const { content, author, blog, path } = params;

    const newComment = await Comment.create({
      content,
      author,
      blog,
      path,
    });
    const BlogObject = await Blog.findByIdAndUpdate(blog, {
      $push: { comments: newComment._id },
    });
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function getAllCommentsByBlogId(params: GetCommentsParams) {
  try {
    connectToDatabase();
    const { blogId, filter } = params;
    
    const AllComments = await Blog.findById(blogId)
    .select("comments")
    .populate({
      path: "comments",model: Comment,
      populate: {
        path: "author",
        model: User,
        select: "username picture name",
      },
    })
    .populate({path: "author",model: User, select: "username picture name"})
 

    // let sortOptions = {};
    // switch (filter) {
    //   case "newest":
    //     sortOptions = { createdAt: -1 };
    //     break;
    //   case "frequent":
    //     sortOptions = { views: -1 };
    //     break;
    //   case "unanswered":
    //     query.answers = { $size: 0 };
    //     break;
    //   default:
    //     sortOptions = { createdAt: -1 };
    //     break;
    // }
    // const comments = await Comment.find()
    //   .populate({ path: "author", model: User })
    //   .sort(sortOptions);

     return AllComments;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function downvoteComment(params: CommentVoteParams) {
  try {
    connectToDatabase();
    const { commentId, userId, hasdownVoted, hasupVoted, path } = params;
    console.log({ commentId, userId, hasdownVoted, hasupVoted, path });

    let updateQuery = {};
    if (hasupVoted) {
      // If the user has upvoted, remove the upvote and add a downvote
      updateQuery = {
        $pull: { upvotes: userId },
        $addToSet: { downvotes: userId },
      };
    } else if (hasdownVoted) {
      // If the user has already downvoted, remove the downvote
      updateQuery = { $pull: { downvotes: userId } };
    } else {
      // If the user hasn't voted before, add a downvote
      updateQuery = { $addToSet: { downvotes: userId } };
    }

    const comment = await Comment.findByIdAndUpdate(commentId, updateQuery, {
      new: true,
    });

    if (!comment) {
      throw new Error("Comment not found");
    }

    // Adjust user reputations based on voting
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasupVoted ? -1 : hasdownVoted ? 0 : -1 },
    });

    await User.findByIdAndUpdate(comment.author, {
      $inc: { reputation: hasupVoted ? -10 : hasdownVoted ? 0 : -10 },
    });

    // Log the interaction
    await Interaction.create({
      comment: comment?._id,
      user: userId,
      action: hasupVoted
        ? "unupvote_comment"
        : hasdownVoted
        ? "undownvote_comment"
        : "downvote_comment",
    });

    // Revalidate the path
    revalidatePath(path);
  } catch (error) {
    console.error(error);
    throw error;
  }
}


export async function upvoteComment(params: CommentVoteParams) {
  try {
    connectToDatabase();
    const { commentId, userId, hasdownVoted, hasupVoted, path } = params;
    console.log({ commentId, userId, hasdownVoted, hasupVoted, path });

    let updateQuery = {};
    if (hasdownVoted) {
      // If the user has downvoted, remove the downvote and add an upvote
      updateQuery = {
        $pull: { downvotes: userId },
        $addToSet: { upvotes: userId },
      };
    } else if (hasupVoted) {
      // If the user has already upvoted, remove the upvote
      updateQuery = { $pull: { upvotes: userId } };
    } else {
      // If the user hasn't voted before, add an upvote
      updateQuery = { $addToSet: { upvotes: userId } };
    }

    const comment = await Comment.findByIdAndUpdate(commentId, updateQuery, {
      new: true,
    });

    if (!comment) {
      throw new Error("comment not found");
    }

    // Adjust user reputations based on voting
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasdownVoted ? 0 : hasupVoted ? -1 : 1 },
    });

    await User.findByIdAndUpdate(comment.author, {
      $inc: { reputation: hasdownVoted ? 0 : hasupVoted ? -10 : 10 },
    });

    // Log the interaction
    await Interaction.create({
      comment: comment?._id,
      user: userId,
      action: hasdownVoted
        ? "undownvote_comment"
        : hasupVoted
        ? "unupvote_comment"
        : "upvote_comment",
    });

    // Revalidate the path
    revalidatePath(path);
  } catch (error) {
    console.error(error);
    throw error;
  }
}


export async function replyToComment(params: CreateReplyParams) {
    try {
        connectToDatabase();
        const { content, author, commentId, path, blog } = params;
        console.log({content, author, commentId, path, blog});
        const reply = JSON.parse(commentId);
        // const comment = await Comment.create({
        // content,
        // author,
        // blog,
        // reply,
        // });
        // revalidatePath(path);
        
        // console.log({comment});
        
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// export async function updateComment(params: UpdateComment) {
//     try {
//         connectToDatabase();
//         const { blogId, content, path, userId } = params;
//         const comment = await Comment.findOneAndUpdate(
//           { _id: blogId, author: userId },
//           { content, updatedAt: Date.now() },
//           { new: true }
//         );
//         revalidatePath(path);

//     } catch (error) {
//         console.log(error);
//         throw error;
//       }
// }
