"use client";
import Link from "next/link";

const scenarios = [
  { id: 1, title: "Interview Introduction", prompt: "Tell me about yourself in 30 seconds." },
  { id: 2, title: "Meet a New Friend", prompt: "Introduce yourself casually to someone new." },
  { id: 3, title: "Classroom Introduction", prompt: "Introduce yourself on the first day of class." },
  { id: 4, title: "Workplace Conversation", prompt: "Explain your role to a teammate." },
];

export default function ScenariosPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Select a Scenario</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {scenarios.map((s) => (
          <Link
            key={s.id}
            href={{
              pathname: "/prompt",
              query: {
                title: s.title,
                prompt: s.prompt,
              },
            }}
          >
            <div className="p-6 bg-white shadow-md rounded-xl hover:shadow-lg cursor-pointer transition">
              <h2 className="text-xl font-semibold mb-2">{s.title}</h2>
              <p className="text-gray-600">Click to practice →</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
