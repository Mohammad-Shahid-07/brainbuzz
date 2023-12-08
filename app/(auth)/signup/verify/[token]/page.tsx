import { verifyToken } from "@/lib/actions/user.action";
interface Props {
  params: {
    token: string;
  };
}
const page = async ({ params }: Props) => {
  await verifyToken(params.token);
  return <div>page</div>;
};

export default page;
