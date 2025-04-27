"use server";

import { AxiosError } from "axios";
import { cookies } from "next/headers";

export const getCookie = async (name: string): Promise<string | null> => {
  const cookieStore = await cookies();
  return cookieStore.get(name)?.value || null;
};

export const setCookie = (
  name: string,
  value: string,
  maxAge: number
): void => {
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}`;
};

export const deleteCookie = (name: string): void => {
  document.cookie = `${name}=; path=/; max-age=0`;
};

export const handleApiError = (error: unknown): string => {
  if (error instanceof AxiosError) {
    return (
      error.response?.data?.error ||
      error.message ||
      "An unexpected error occurred."
    );
  }
  if (error instanceof Error) {
    return error.message || "An unexpected error occurred.";
  }
  return "An unexpected error occurred.";
};
