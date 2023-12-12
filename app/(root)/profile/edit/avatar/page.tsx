import NameUser from "@/components/forms/NameUser";
import ChooseAvatar from "@/components/shared/ChooseAvatar";
import { getUserById } from "@/lib/actions/user.action";

const Page = async () => {


  const mongoUser = await getUserById(true);

  return (
    <section>
      <div>
        <h1 className="h1-bold text-dark100_light900">Profile</h1>
        <NameUser name={mongoUser?.name} type="Name" />
      </div>
      <div>
        <h1 className="h1-bold text-dark100_light900">Choose an avatar</h1>
        <ChooseAvatar />
      </div>
    </section>
  );
};

export default Page;
