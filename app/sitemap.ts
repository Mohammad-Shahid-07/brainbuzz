

import { getQuestions } from "@/lib/actions/question.action";
import { getAllTags } from "@/lib/actions/tag.actions";
import { getAllUsers } from "@/lib/actions/user.action";

export default async function sitemap() {
  const baseUrl = "https://stack-with-next-mohammad-shahid-07.vercel.app";

  const allUsers = await getAllUsers({});
  const userUrls =
    allUsers?.users?.map((user) => {
      return {url: `${baseUrl}/profile/${user.username}`};
    }) ?? [];

  const allQuestions = await getQuestions({});
  const questionUrls =
    allQuestions?.questions?.map((item) => {
        return {url: `${baseUrl}/question/${item?.slug}/${item?._id}`};
    }) ?? [];
  const allTags = await getAllTags({});
  const tagUrls =
    allTags?.tags?.map((item) => {
        return {url: `${baseUrl}/tags/${item?.name}`};
    }) ?? [];

  return [
    {
      url: baseUrl,
    },
    ...userUrls,
    ...questionUrls,
    ...tagUrls,
     
  ];
}
