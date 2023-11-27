import { formatLargeNumber } from "@/lib/utils";
import Image from "next/image";

interface StatsCardProps {
  imgUrl: string;
  value: number;
  title: string;
}
const StatsCard = ({ imgUrl, value, title }: StatsCardProps) => {
  return (
    <div className="light-border background-light900_dark300  darK:shadow-dark-200 flex  items-center justify-start gap-4 rounded-md border p-6 shadow-light-200 dark:shadow-dark-200">
      <Image src={imgUrl} alt={title} width={40} height={50} />
      <div className="">
        <p className="paragraph-semibold text-dark200_light900">{value}</p>

        <p className="paragraph-semibold text-dark200_light900">{title}</p>
      </div>
    </div>
  );
};

interface Props {
  totalAnswers: number;
  totalQuestions: number;
}
const Stats = ({ totalAnswers, totalQuestions }: Props) => {
  return (
    <div className="mt-10">
      <div className="h3-semibold text-dark200_light900">
        <div className="mt-5 grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-4">
          <div className="light-border background-light900_dark300  darK:shadow-dark-200 flex  items-center justify-evenly gap-4 rounded-md border p-6 shadow-light-300 dark:shadow-dark-200">
            <div className="">
              <p className="paragraph-semibold text-dark200_light900">
                {formatLargeNumber(totalQuestions)}
              </p>
              <p className="body-medium text-dark400_light700">Questions</p>
            </div>
            <div className="">
              <p className="paragraph-semibold text-dark200_light900">
                {formatLargeNumber(totalAnswers)}
              </p>
              <p className="body-medium text-dark400_light700">Answers</p>
            </div>
          </div>
          <StatsCard
            imgUrl="/assets/icons/gold-medal.svg"
            value={0}
            title="Gold Badges"
          />

          <StatsCard
            imgUrl="/assets/icons/silver-medal.svg"
            value={0}
            title="Silver Badges"
          />
          <StatsCard
            imgUrl="/assets/icons/bronze-medal.svg"
            value={0}
            title="Bronze Badges"
          />
        </div>
      </div>
    </div>
  );
};

export default Stats;
