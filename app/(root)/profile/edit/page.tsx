import Profile from '@/components/forms/Profile';
import {  getUserById } from '@/lib/actions/user.action';
import { URLProps } from '@/types';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const page = async({params}: URLProps) => {
  const session = await getServerSession(authOptions);
  
  const userId = session?.user?.id || null;
  if(!userId) {
    return null;

  }
  const mongoUser = await getUserById(userId);

  return (
    <>
    
    <h1 className='h1-bold text-dark100_light900'>Edit Profile</h1>
    <div className="mt-9">
        <Profile
        userId={userId}
        user={JSON.stringify(mongoUser)}
        />
    </div>
    </>
  )
}

export default page