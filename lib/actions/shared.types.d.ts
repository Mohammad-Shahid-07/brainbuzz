import { Schema } from "mongoose";

import { IUser } from "@/mongodb";

import Account from "next-auth";

export interface CreateAnswerParams {
  content: string;
  author: string; // User ID
  question: string; // Question ID
  path: string;
}

export interface GetAnswersParams {
  questionId: string;
  sortBy?: string;
  page?: number;
  pageSize?: number;
}

export interface AnswerVoteParams {
  answerId: string;
  userId: string;
  hasupVoted: boolean;
  hasdownVoted: boolean;
  path: string;
}

export interface DeleteAnswerParams {
  answerId: string;
  path: string;
}

export interface SearchParams {
  query?: string | null;
  type?: string | null;
}

export interface RecommendedParams {
  userId: string;
  page?: number;
  pageSize?: number;
  searchQuery?: string;
}

export interface ViewQuestionParams {
  questionId: string;
  userId: string | undefined;
}
export interface ViewBlogParams {
  blogId: string;
  userId: string | undefined;
}

export interface JobFilterParams {
  query: string;
  page: string;
}

export interface GetQuestionsParams {
  page?: number;
  pageSize?: number;
  searchQuery?: string;
  filter?: string;
}

export interface CreateQuestionParams {
  title: string;
  content: string;
  tags: string[];
  author: Schema.Types.ObjectId | IUser;
  path: string;
}

export interface GetQuestionByIdParams {
  questionId: string;
}

export interface QuestionVoteParams {
  questionId: string;
  userId: string;
  hasupVoted: boolean;
  hasdownVoted: boolean;
  path: string;
}

export interface DeleteQuestionParams {
  questionId: string;
  path: string;
}

export interface EditQuestionParams {
  questionId: string;
  title: string;
  content: string;
  path: string;
}

export interface GetAllTagsParams {
  page?: number;
  pageSize?: number;
  filter?: string;
  searchQuery?: string;
}

export interface GetQuestionsByTagIdParams {
  tagName: string;
  page?: number;
  pageSize?: number;
  searchQuery?: string;
}

export interface GetTopInteractedTagsParams {
  userId: string;
  limit?: number;
}

export interface CreateUserParams {
  name: string;
  username: string;
  email: string;
  password: string;
  path: string;
}

export interface GetUserByIdParams {
  userId: string;
}

export interface GetAllUsersParams {
  page?: number;
  pageSize?: number;
  filter?: string;
  searchQuery?: string; // Add searchQuery parameter
}

export interface UpdateUserParams {
  userId: string;
  updateData: Partial<IUser>;
  path: string;
}

export interface ToggleSaveQuestionParams {
  userId: string;
  questionId: string;
  path: string;
}
export interface ToggleSaveBlogParams {
  userId: string;
  blogId: string;
  path: string;
}
export interface GetSavedQuestionsParams {
  userId: string;
  page?: number;
  pageSize?: number;
  filter?: string;
  searchQuery?: string;
}
export interface GetSavedBlogsParams {
  userId: string;
  page?: number;
  pageSize?: number;
  filter?: string;
  searchQuery?: string;
}

export interface GetUserStatsParams {
  userId: string;
  page?: number;
  pageSize?: number;
}

export interface DeleteUserParams {
  password: string;
}
export interface UpdateUserImageParams {
  image: string;
  path: string;
}

export interface ChangePassParams {
  userId: string;
  newPassword: string;
  oldPassword: string;
  path: string;
}

export interface CreateBlogParams {
  title: string;
  content: string;
  description: string;
  image: string;
  tags: string[];
  path: string;
  author: Schema.Types.ObjectId | IUser;
}

export interface GetAllBlogsParams {
  page?: number;
  pageSize?: number;
  filter?: string;
  searchQuery?: string;
}

export interface GetBlogBySlugParams {
  slug: string;
}

export interface BlogVoteParams {
  blogId: string;
  userId: string;
  hasupVoted: boolean;
  hasdownVoted: boolean;
  path: string;
}

export interface CommentVoteParams {
  commentId: string;
  userId: string;
  hasupVoted: boolean;
  hasdownVoted: boolean;
  path: string;
}

export interface CreateCommentParams {
  content: string;
  author: string; // User ID
  blog: string; // Blog ID
  path: string;
}
export interface CreateReplyParams {
  content: string;
  author: string; // User ID
  commentId: string; // comment replying to
  path: string;
  blog: string;
}

export interface GetCommentsParams {
  blogId: string;
  filter?: string;
}

export interface CreateUserWithCredentialsParams {
  user: {
    name: string;
    email: string;
    image: string;
    // Add any other user-related fields here
  };
  account: Account;
}

export interface TwoFactorSystemParams {
  path: string;
  isTwoFactorEnabled: boolean;
}
