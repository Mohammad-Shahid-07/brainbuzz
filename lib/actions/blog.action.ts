"use server";

import slugify from "slugify";
import { connectToDatabase } from "../mongoose";
import {
  BlogVoteParams,
  CreateBlogParams,
  GetAllBlogsParams,
  GetBlogBySlugParams,
  GetSavedBlogsParams,
  ToggleSaveBlogParams,
} from "./shared.types";
import Blog from "@/database/blog.model";
import Tags from "@/database/tag.model";
import { FilterQuery } from "mongoose";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";
import Interaction from "@/database/interaction.model";


export async function createBlog(params: CreateBlogParams) {
  try {
    connectToDatabase();
    const { title, content, description, author, image, tags, path } = params;

    const slug = slugify(title, {
      replacement: "-", // replace spaces with hyphen
      remove: /[^a-zA-Z0-9\s]/g, // remove characters that are not letters, numbers, or spaces
      lower: true, // convert to lower case (if needed), defaults to `false`
      strict: false, // strip special characters except replacement, defaults to `false`
      locale: "vi", // language code of the locale to use
      trim: true,
    });
    const blog = await Blog.create({
      title,
      content,
      description,
      image,
      author,
      slug,
    });
    const tagDocuments = [];

    // Create the tags or get them if they already exist
    for (const tag of tags) {
      const existingTag = await Tags.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $push: { blogs: blog._id } },
        { upsert: true, new: true },
      );

      tagDocuments.push(existingTag._id);
    }
    await Blog.findByIdAndUpdate(blog._id, {
      $push: { tags: { $each: tagDocuments } },
    });
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAllBlogs(params: GetAllBlogsParams) {
  try {
    connectToDatabase();
    connectToDatabase();
    const { searchQuery, filter, page = 1, pageSize = 20 } = params;
    const skipAmount = (page - 1) * pageSize;
    const query: FilterQuery<typeof Blog> = {};
    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, "i") } },
        { content: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }
    let sortOptions = {};
    switch (filter) {
      case "newest":
        sortOptions = { createdAt: -1 };
        break;
      case "frequent":
        sortOptions = { views: -1 };
        break;
      case "unanswered":
        query.answers = { $size: 0 };
        break;
      default:
        sortOptions = { createdAt: -1 };
        break;
    }
    const blogs = await Blog.find()
      .populate({ path: "tags", model: Tags })
      .populate({ path: "author", model: User })
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortOptions);
    const totalQuestions = await Blog.countDocuments(query);
    const isNext = totalQuestions > skipAmount + blogs.length;
    return { blogs, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getBlogBySlug(params: GetBlogBySlugParams) {
  try {
    connectToDatabase();
    const { slug } = params;
    const blog = await Blog.findOne({ slug })
      .populate({ path: "tags", model: Tags, select: "_id name" })
      .populate({
        path: "author",
        model: User,
        select: "username clerkId name picture",
      });
    return blog;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function downvoteBlog(params: BlogVoteParams) {
  try {
    connectToDatabase();
    const { blogId, userId, hasdownVoted, hasupVoted, path } = params;
    console.log({ blogId, userId, hasdownVoted, hasupVoted, path });

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

    const blog = await Blog.findByIdAndUpdate(blogId, updateQuery, {
      new: true,
    });

    if (!blog) {
      throw new Error("Blog not found");
    }

    // Adjust user reputations based on voting
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasupVoted ? -1 : hasdownVoted ? 0 : -1 },
    });

    await User.findByIdAndUpdate(blog.author, {
      $inc: { reputation: hasupVoted ? -10 : hasdownVoted ? 0 : -10 },
    });

    // Log the interaction
    await Interaction.create({
      blog: blog?._id,
      user: userId,
      tags: blog?.tags,
      action: hasupVoted
        ? "unupvote_blog"
        : hasdownVoted
        ? "undownvote_blog"
        : "downvote_blog",
    });

    // Revalidate the path
    revalidatePath(path);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function upvoteBlog(params: BlogVoteParams) {
  try {
    connectToDatabase();
    const { blogId, userId, hasdownVoted, hasupVoted, path } = params;

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

    const blog = await Blog.findByIdAndUpdate(blogId, updateQuery, {
      new: true,
    });

    if (!blog) {
      throw new Error("Blog not found");
    }

    // Adjust user reputations based on voting
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasdownVoted ? 0 : hasupVoted ? -1 : 1 },
    });

    await User.findByIdAndUpdate(blog.author, {
      $inc: { reputation: hasdownVoted ? 0 : hasupVoted ? -10 : 10 },
    });

    // Log the interaction
    await Interaction.create({
      blog: blog?._id,
      user: userId,
      tags: blog?.tags,
      action: hasdownVoted
        ? "undownvote_blog"
        : hasupVoted
        ? "unupvote_blog"
        : "upvote_blog",
    });

    // Revalidate the path
    revalidatePath(path);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function toggleSaveBlog(params: ToggleSaveBlogParams) {
  try {
    connectToDatabase();
    const { blogId, userId, path } = params;
    console.log(params);

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    let updateQuery = {};

    if (user.savedBlogs.includes(blogId)) {
      updateQuery = { $pull: { savedBlogs: blogId } };
    } else {
      updateQuery = { $addToSet: { savedBlogs: blogId } };
    }
    await User.findByIdAndUpdate(userId, updateQuery, {
      new: true,
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getSavedBlogs(params: GetSavedBlogsParams) {
  try {
    connectToDatabase();
    const { clerkId, searchQuery, filter, page = 1, pageSize = 10 } = params;

    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof Blog> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, "i") } }
      : {};

    let sortOptions = {};

    switch (filter) {
      case "most_recent":
        sortOptions = { createdAt: -1 };
        break;
      case "oldest":
        sortOptions = { createdAt: 1 };
        break;
      case "most_voted":
        sortOptions = { upvoted: -1 };
        break;
      case "most_viewed":
        sortOptions = { views: -1 };
        break;
      case "most_answered":
        sortOptions = { answers: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
        break;
    }

    const user = await User.findOne({ clerkId }).populate({
      path: "savedBlogs",
      model: Blog,
      match: query,
      options: {
        sort: sortOptions,
        skip: skipAmount,
        limit: pageSize + 1,
      },
      populate: [
        { path: "tags", model: Tags, select: "_id name" },
        {
          path: "author",
          model: User,
          select: "username clerkId name picture",
        },
      ],
    });
    if (!user) {
      throw new Error("User not found");
    }

    const isNext = user.savedBlogs.length > pageSize;

    const savedBlogs = user.savedBlogs;
    return { blogs: savedBlogs, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}


