"use client";

import { useState, useRef, useEffect } from "react";
import { analyzePostureCues } from "@/lib/postureAnalysis";
import { generateFeedback } from "@/lib/feedbackEngine";
import { generateAiFeedback } from "@/lib/actions";

export default function PostureAnalysisPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const startAnalysis = async () => {
    try {
      setError(null);
      setFeedback(null);
      setLoading(true);

      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }

      setIsRecording(true);
      setLoading(false);

      if (videoRef.current) {
        const result = await analyzePostureCues(videoRef.current);
        
        const feedbackData = {
          ...result,
        };
        
        // Try to get AI feedback first
        const aiResult = await generateAiFeedback(feedbackData, "posture");
        
        if (aiResult) {
          setFeedback(aiResult);
        } else {
          // Fallback to local engine
          const generated = generateFeedback(feedbackData);
          setFeedback(generated);
        }
      }
    } catch (err) {
      console.error("Error starting analysis:", err);
      setError("Could not access camera. Please allow camera permissions.");
      setLoading(false);
      setIsRecording(false);
    }
  };

  const stopAnalysis = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsRecording(false);
  };

  return (
    <div className="min-h-screen py-12 px-6 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Body Language & <span className="text-blue-600">Posture</span>
          </h1>
          <p className="text-lg text-gray-600">
            Analyze your posture, head tilt, and physical presence in real-time.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="relative aspect-video bg-gray-900 flex items-center justify-center">
            <video
              ref={videoRef}
              className="w-full h-full object-cover transform scale-x-[-1]" // Mirror effect
              muted
              playsInline
            />
            {!isRecording && !feedback && !loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <p className="text-white text-xl font-medium">Camera Preview</p>
              </div>
            )}
          </div>

          <div className="p-8 text-center">
            {error && <p className="text-red-600 mb-4">{error}</p>}
            
            {!isRecording ? (
              <button
                onClick={startAnalysis}
                disabled={loading}
                className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {loading ? "Initializing..." : feedback ? "Retake Analysis" : "Start Analysis"}
              </button>
            ) : (
              <button
                onClick={stopAnalysis}
                className="px-8 py-4 bg-red-600 text-white rounded-xl font-bold text-lg hover:bg-red-700 transition-all shadow-lg hover:shadow-xl animate-pulse"
              >
                Stop & Analyze
              </button>
            )}
          </div>
        </div>

        {feedback && (
          <div className="mt-12 space-y-8 animate-fade-in">
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">AI Feedback</h2>
              <div className="space-y-4">
                {feedback.feedback.map((item: string, i: number) => (
                  <div key={i} className="flex gap-4 items-start p-4 bg-blue-50 rounded-xl">
                    <span className="text-2xl">💡</span>
                    <p className="text-gray-700 leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 text-center">
                <p className="text-gray-500 text-sm mb-2">Overall Posture Score</p>
                <p className="text-5xl font-black text-blue-600">{feedback.overallScore}/100</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}