import clsx from "clsx"; // constructing className strings conditionally.
import type { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge"; // merge tailwind classes without style conflicts.

/* cn - ClassName. Utility function for merging 
tailwind classes without conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
