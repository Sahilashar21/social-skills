"use client";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">

      {/* NAVBAR */}
      <header className="flex justify-between items-center px-8 py-4 shadow-sm bg-white">
        <h1 className="text-2xl font-extrabold text-blue-700">SocialSkill AI</h1>
        
        <div className="flex gap-4">
          <Link
            href="/login"
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Login
          </Link>

          <Link
            href="/signup"
            className="px-4 py-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            Sign Up
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="text-center mt-14 max-w-3xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-gray-800 leading-snug">
          Build Your <span className="text-blue-600">Confidence</span> & Social Skills with AI
        </h2>

        <p className="mt-4 text-gray-600 text-lg">
          Practice speaking, improve expressions, fix posture, and receive real-time AI feedback.
        </p>

        <Link
          href="/profile"
          className="mt-8 inline-block px-8 py-4 bg-blue-600 text-white rounded-xl text-lg hover:bg-blue-700"
        >
          Start Assessment
        </Link>
      </section>

      {/* MODULES */}
      <section className="mt-16 px-10 pb-20">
        <h3 className="text-2xl font-bold mb-6 text-gray-700">Explore Modules</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* 1. Scenario & Response */}
          <Link href="/scenarios" className="p-6 bg-white shadow-md rounded-xl hover:shadow-lg transition cursor-pointer">
            <h2 className="text-xl font-semibold text-blue-600 mb-2">Scenario & Response Capture</h2>
            <p className="text-gray-600 text-sm">
              Choose a scenario, view prompt, and record your response.
            </p>
          </Link>

          {/* 2. Speech & Tone Analysis */}
          <Link href="/speech-analysis" className="p-6 bg-white shadow-md rounded-xl hover:shadow-lg transition cursor-pointer">
            <h2 className="text-xl font-semibold text-blue-600 mb-2">Speech & Tone Analysis</h2>
            <p className="text-gray-600 text-sm">
              Analyze clarity, tone, speed, filler words, and fluency.
            </p>
          </Link>

          {/* 3. Facial Emotion Analysis */}
          <Link href="/emotion" className="p-6 bg-white shadow-md rounded-xl hover:shadow-lg transition cursor-pointer">
            <h2 className="text-xl font-semibold text-blue-600 mb-2">Facial Emotion Analysis</h2>
            <p className="text-gray-600 text-sm">
              Detect emotions, eye contact, and facial expressions.
            </p>
          </Link>

          {/* 4. Body Language */}
          <Link href="/posture" className="p-6 bg-white shadow-md rounded-xl hover:shadow-lg transition cursor-pointer">
            <h2 className="text-xl font-semibold text-blue-600 mb-2">Body Language</h2>
            <p className="text-gray-600 text-sm">
              Identify posture, gestures, and confidence level.
            </p>
          </Link>

          {/* 5. AI Feedback Engine */}
          <Link href="/feedback" className="p-6 bg-white shadow-md rounded-xl hover:shadow-lg transition cursor-pointer">
            <h2 className="text-xl font-semibold text-blue-600 mb-2">AI Feedback Engine</h2>
            <p className="text-gray-600 text-sm">
              Get AI-powered communication improvement suggestions.
            </p>
          </Link>

          {/* 6. Progress Dashboard */}
          <Link href="/dashboard" className="p-6 bg-white shadow-md rounded-xl hover:shadow-lg transition cursor-pointer">
            <h2 className="text-xl font-semibold text-blue-600 mb-2">Progress Dashboard</h2>
            <p className="text-gray-600 text-sm">
              Track your communication progress over time.
            </p>
          </Link>

        </div>
      </section>
    </div>
  );
}
