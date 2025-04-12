import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import apiClient from "@/lib/api.ts";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const handleLogout = async () => {
  await apiClient.post('auth/signout');
  window.location.reload();
}
