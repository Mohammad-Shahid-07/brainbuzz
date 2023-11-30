import Image from "next/image";
import Link from "next/link";

export default function Custom404() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-dark-400 p-5 py-2">
      <Image
        src="/assets/icons/404.svg"
        alt="404"
        width={400}
        height={400}
        className="w-1/2 max-w-[400px]"
      />
      <h1 className="h1-bold text-dark100_light900 mt-10 capitalize">
        Page Not Found
      </h1>
      <p className="paragraph-medium text-dark100_light900 mt-3 text-center">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-5  rounded bg-[#6a63fe] px-2 py-3 font-extrabold text-[#3b2f6f]"
      >
        Go Back Home
      </Link>
    </div>
  );
}
