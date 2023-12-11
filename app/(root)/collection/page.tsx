import Filter from "@/components/shared/Filter";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { QuestionFilters } from "@/constants/filters";

import { SearchParamsProps } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuestionsTab from "@/components/shared/QuestionsTab";
import SavedBlogsTab from "@/components/shared/SavedBlogsTab";
import { getUserById} from "@/lib/actions/user.action";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function Home({ searchParams }: SearchParamsProps) {
  
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id || "";
  if (!userId) redirect('/signin');
  const userInfo = await getUserById(userId);



  return (
    <>
      <h1 className="h1-bold text-dark100_light900 ">Saved </h1>

      <div className="mt-11 flex  justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/collection"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for a specific question"
          otherClasses="flex-1"
        />

        <Filter
          filters={QuestionFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>
      <div className="mt-10 flex gap-10">
        <Tabs defaultValue="questions" className="flex-1">
          <TabsList className="background-light800_dark400 min-h-[42px] p-1">
            <TabsTrigger value="questions" className="tab">
             Saved Questions
            </TabsTrigger>
            <TabsTrigger value="blogs" className="tab">
              Saved Blogs
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="questions"
            className="mt-5 flex w-full flex-col gap-6"
          >
            <QuestionsTab
        
              searchParams={searchParams}
              userId={userInfo?._id}
              route='/collection'
            />
          </TabsContent>
          <TabsContent value="blogs" className="flex w-full flex-col gap-6">
            <SavedBlogsTab
              searchParams={searchParams}
              userId={userInfo?._id}
             
            />
          </TabsContent>
        </Tabs>
      </div>
      
     
    </>
  );
}
