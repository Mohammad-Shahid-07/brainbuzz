import Image from "next/image";
import Link from "next/link";

interface ProfileLinkProps {
  imgUrl: string;
  href?: string;
  title: string;
}
const ProfileLink = ({ imgUrl, href, title }: ProfileLinkProps) => {
  return (
    <div className="flex-center gap-1">
      <Image src={imgUrl} alt="icon" width={16} height={16} />
      {href ? (
        <Link href={href} className="paragraph-medium text-blue-500">
          {title}{" "}
        </Link>
      ) : (
        <p className="paragraph-regular text-dark400_light700">{title}</p>
      )}
    </div>
  );
};

export default ProfileLink;
