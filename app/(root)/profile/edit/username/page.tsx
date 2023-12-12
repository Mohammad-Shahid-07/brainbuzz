
import NameUser from "@/components/forms/NameUser";
import { getUserById } from "@/lib/actions/user.action";


const Page = async () => {
 
  const mongoUser = await getUserById(true);

  return (
    <section>
      <div>
        <h1 className="h1-bold text-dark100_light900">Profile</h1>
        <NameUser username={mongoUser?.username} type="Username" />
      </div>
      
    </section>
  );
};

export default Page;
