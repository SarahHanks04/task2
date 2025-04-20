import { AxiosError } from "axios";

interface ErrorDetails {
  message: string;
  status?: number;
  data?: any;
}

export const handleApiError = (error: unknown, context: string): never => {
  const isBrowser = typeof window !== "undefined";
  let errorDetails: ErrorDetails = { message: "An unexpected error occurred" };

  if (error instanceof AxiosError) {
    errorDetails = {
      message: error.response?.data?.error || error.message,
      status: error.response?.status,
      data: error.response?.data,
    };
  } else if (error instanceof Error) {
    errorDetails.message = error.message;
  }

  isBrowser
    ? console.error(`${context} (client):`, errorDetails)
    : console.error(`${context} (server):`, {
        message: errorDetails.message,
        status: errorDetails.status,
        stack: error instanceof Error ? error.stack : undefined,
      });

  throw new Error(errorDetails.message);
};
