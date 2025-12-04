"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PromptPage() {
  const params = useSearchParams();
  const router = useRouter();

  const title = params.get("title");
  const prompt = params.get("prompt");

  useEffect(() => {
    if (title && prompt) {
      localStorage.setItem("scenario", JSON.stringify({ title, prompt }));
    }
  }, [title, prompt]);

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>

      <div className="bg-white p-6 shadow-lg rounded-xl text-lg text-gray-700">
        {prompt}
      </div>

      <button
        onClick={() => router.push("/record")}
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
      >
        Start Recording
      </button>
    </div>
  );
}
