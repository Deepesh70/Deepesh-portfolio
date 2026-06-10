// Helps in avoiding tailwind conflicts or overlapping  
// clsx - is used to combine all the class values
// twMerge - is used to merge all the class values
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]){
    return twMerge(clsx(inputs));
}