"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screenvflex flex-col items-center justify-center bg-gray-950 text-white px-6">
      <h1 className="text-4xl font-bold text-red-500 mb-4">
        Somthing went wrong
      </h1>
      <p>{error.message || "An unexpected error ocurred. Please try again "}</p>

      <button
        onClick={reset}
        className="px-6 py-4 rounded-lg bg-red-500 hover:bg-red-600 transition font-semibold"
      >
        Try again
      </button>
    </div>
  );
}
