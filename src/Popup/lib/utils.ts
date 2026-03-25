import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/** Merges Tailwind class names with tailwind-merge conflict resolution. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
