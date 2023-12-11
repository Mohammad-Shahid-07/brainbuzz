import { SidebarLink } from "@/types";
export const themes = [
  { value: "light", label: "Light", icon: "/assets/icons/sun.svg" },
  { value: "dark", label: "Dark", icon: "/assets/icons/moon.svg" },
  { value: "system", label: "System", icon: "/assets/icons/computer.svg" },
];
export const sidebarLinks: SidebarLink[] = [
  {
    imgURL: "/assets/icons/home.svg",
    route: "/",
    label: "Home",
  },
  {
    imgURL: "/assets/icons/users.svg",
    route: "/community",
    label: "Community",
  },
  {
    imgURL: "/assets/icons/star.svg",
    route: "/collection",
    label: "Collections",
  },
  {
    imgURL: "/assets/icons/suitcase.svg",
    route: "/blogs",
    label: "Blogs",
  },
  {
    imgURL: "/assets/icons/tag.svg",
    route: "/tags",
    label: "Tags",
  },
  {
    imgURL: "/assets/icons/user.svg",
    route: "/profile",
    label: "Profile",
  },
  {
    imgURL: "/assets/icons/question.svg",
    route: "/ask-question",
    label: "Ask a question",
  },
];

export const BADGE_CRITERIA = {
  QUESTION_COUNT: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  ANSWER_COUNT: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  QUESTION_UPVOTES: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  ANSWER_UPVOTES: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  TOTAL_VIEWS: {
    BRONZE: 1000,
    SILVER: 10000,
    GOLD: 100000,
  },
};

type ProfileUrl = string;

export const ProfileUrls: ProfileUrl[] = [
  "https://photos.app.goo.gl/BL772yoiTPPQbPyH8",
  "https://photos.app.goo.gl/wuQ8rtA73V5AbamVA",
  "https://photos.app.goo.gl/R4xtMdWqw9N8JUun6",
  "https://photos.app.goo.gl/pT66gTqD5RMjyC338",
  "https://photos.app.goo.gl/gJjyTJK5P8banWty6",
  "https://photos.app.goo.gl/ZYhSN74TzSv1k1YX7",
  "https://photos.app.goo.gl/khLx9u1CJQwWzsfd7",
  "https://photos.app.goo.gl/fayhs3ZuBaFzhNrS6",
  "https://photos.app.goo.gl/fayhs3ZuBaFzhNrS6",
  "https://photos.app.goo.gl/xeejMh5pSXaJ31wq8",
  "https://photos.app.goo.gl/FcDdHLpqhjdnhtin7",
  "https://photos.app.goo.gl/NAqshLjwLeide14g7",
  "https://photos.app.goo.gl/8CmwhwUtaFrj7b277",
  "https://photos.app.goo.gl/9ujm6AmFVbK1H7Ly5",
  "https://photos.app.goo.gl/hsr6AGGDm8Wxvwrq6",
  "https://photos.app.goo.gl/joAUGjtLrifvoKKZ7",
];

export function getRandomProfileUrl(): ProfileUrl {
  const randomIndex = Math.floor(Math.random() * ProfileUrls.length);
  return ProfileUrls[randomIndex];
}
