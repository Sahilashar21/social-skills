"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function RecordPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const [promptData, setPromptData] = useState<{ title: string; prompt: string } | null>(null);
  const [recording, setRecording] = useState(false);
  const [videoURL, setVideoURL] = useState("");
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("scenario");
    if (saved) {
      setPromptData(JSON.parse(saved));
    }
  }, []);

  async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }

    const recorder = new MediaRecorder(stream);
    const chunks: BlobPart[] = [];

    recorder.ondataavailable = (e) => chunks.push(e.data);

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      setVideoURL(url);

      const reader = new FileReader();
      reader.onloadend = () => {
        localStorage.setItem("recording", reader.result as string);
      };
      reader.readAsDataURL(blob);
    };

    mediaRecorderRef.current = recorder;
    recorder.start();
    setRecording(true);

    let sec = 0;
    const interval = setInterval(() => {
      sec += 1;
      setTimer(sec);
      if (!recording) clearInterval(interval);
    }, 1000);
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    setRecording(false);

    const tracks = (videoRef.current?.srcObject as MediaStream)?.getTracks();
    tracks?.forEach((track) => track.stop());
  }

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold mb-4">Record Your Response</h1>

      {promptData && (
        <div className="bg-white p-4 rounded-xl shadow mb-4">
          <h2 className="font-semibold text-lg">{promptData.title}</h2>
          <p className="text-gray-600">{promptData.prompt}</p>
        </div>
      )}

      <video
        ref={videoRef}
        className="w-full max-w-xl bg-black rounded-xl shadow-md"
      ></video>

      <p className="text-lg mt-3">⏱ Timer: {timer}s</p>

      <div className="flex gap-4 mt-6">
        {!recording ? (
          <button
            onClick={startRecording}
            className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700"
          >
            Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700"
          >
            Stop Recording
          </button>
        )}
      </div>

      {videoURL && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Preview</h2>
          <video src={videoURL} controls className="w-full max-w-xl mt-2 rounded-xl shadow-md" />
        </div>
      )}

      {videoURL && (
        <button
          onClick={() => router.push("/analysis")}
          className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
        >
          Continue to Analysis
        </button>
      )}
    </div>
  );
}
