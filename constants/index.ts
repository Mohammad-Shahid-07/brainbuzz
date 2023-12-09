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
  "https://i.postimg.cc/BnCyJ853/1.jpg",
  "https://i.postimg.cc/zXg0GLrM/10.jpg",
  "https://i.postimg.cc/hjY1Sn3c/11.jpg",
  "https://i.postimg.cc/GtsJtfZY/12.jpg",
  "https://i.postimg.cc/W3z7Lz85/13.jpg",
  "https://i.postimg.cc/3xQ94Krw/14.jpg",
  "https://i.postimg.cc/7PcK43p0/15.jpg",
  "https://i.postimg.cc/PJByMHm2/16.jpg",
  "https://i.postimg.cc/FHv8tbLG/2.jpg",
  "https://i.postimg.cc/15w2Y7ff/3.jpg",
  "https://i.postimg.cc/mZ0KjWZv/4.jpg",
  "https://i.postimg.cc/jqWGyST6/5.jpg",
  "https://i.postimg.cc/SjFLMrhP/6.jpg",
  "https://i.postimg.cc/mr8S5CYc/7.jpg",
  "https://i.postimg.cc/cJsmhXny/8.jpg",
  "https://i.postimg.cc/RZ1dwjqL/9jpg.jpg"
];

export function getRandomProfileUrl(): ProfileUrl {
  const randomIndex = Math.floor(Math.random() * ProfileUrls.length);
  return ProfileUrls[randomIndex];
}
