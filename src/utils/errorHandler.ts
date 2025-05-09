import { AxiosError } from "axios";
import { ErrorDetails } from "../lib/types";

export const handleApiError = (
  error: unknown,
  context: string,
  customMessage?: string
): never => {
  let errorDetails: ErrorDetails = {
    message: customMessage || "An unexpected error occurred",
  };

  if (error instanceof AxiosError) {
    errorDetails = {
      message: error.response?.data?.error || error.message,
      status: error.response?.status,
      data: error.response?.data,
    };
  } else if (error instanceof Error) {
    errorDetails.message = error.message;
  }

  console.error(`${context}:`, {
    message: errorDetails.message,
    status: errorDetails.status,
    stack: error instanceof Error ? error.stack : undefined,
  });

  throw new Error(errorDetails.message);
};
