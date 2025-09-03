import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";


export const locales = ['en', 'zh'] as const;
export type Lang = typeof locales[number];
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
