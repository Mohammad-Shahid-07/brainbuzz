import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getTimeStamo = (createdAt: Date) => {
  const now = new Date();
  const timeDifference = now.getTime() - createdAt.getTime();

  // Calculate time in seconds, minutes, hours, days, months, and years
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30); // Approximate months
  const years = Math.floor(days / 365); // Approximate years

  if (years > 1) {
    return `${years} years ago`;
  } else if (months > 1) {
    return `${months} months ago`;
  } else if (days > 1) {
    return `${days} days ago`;
  } else if (hours > 1) {
    return `${hours} hours ago`;
  } else if (minutes > 1) {
    return `${minutes} minutes ago`;
  } else {
    return `${seconds} seconds ago`;
  }
};

export const formatLargeNumber = (num: number): string => {
  if (num >= 1e9) {
    return (num / 1e9).toFixed(2) + ' billion';
  } else if (num >= 1e6) {
    return (num / 1e6).toFixed(2) + ' million';
  } else if (num >= 1e3) {
    return (num / 1e3).toFixed(2) + ' K';
  } else {
    return num.toString();
  }
};

// Example usage:

