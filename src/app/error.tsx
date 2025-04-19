"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4 text-red-600">
          Something went wrong!
        </h2>
        <p className="mb-4">{error.message}</p>
        <button
          onClick={() => reset()}
          className="px-4 text-sm py-2 bg-red-500 text-white rounded"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
