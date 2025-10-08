import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isImageUrl(url: string) {
  return typeof url === 'string' && url.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i);
}
