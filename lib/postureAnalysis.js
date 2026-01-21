// Suppress specific TF Lite info messages
const originalConsoleError = console.error;
console.error = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('TensorFlow Lite XNNPACK delegate')) {
    return;
  }
  originalConsoleError(...args);
};

let poseLandmarker;
let runningMode = "VIDEO";

// Initialize the landmarker
async function createPoseLandmarker() {
  const { PoseLandmarker, FilesetResolver } = await import("@mediapipe/tasks-vision");
  const filesetResolver = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
  );
  poseLandmarker = await PoseLandmarker.createFromOptions(filesetResolver, {
    baseOptions: {
      modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`,
      delegate: "GPU"
    },
    runningMode: runningMode,
    numPoses: 1
  });
  console.log("Pose landmarker created");
}

export async function analyzePostureCues(videoElement) {
  if (!poseLandmarker) {
    console.log("Waiting for pose landmarker to be created");
    await createPoseLandmarker();
    if(!poseLandmarker) {
        console.error("PoseLandmarker not created after wait.");
        return null;
    }
  }

  let goodPostureFrames = 0;
  let frameCount = 0;
  let issuesDetected = new Set();

  const processFrame = async () => {
    if (videoElement.readyState < 2) return;

    let results;
    try {
      const startTimeMs = performance.now();
      results = poseLandmarker.detectForVideo(videoElement, startTimeMs);
    } catch (e) {
      return;
    }

    frameCount++;

    if (results.landmarks && results.landmarks.length > 0) {
      const landmarks = results.landmarks[0];
      
      // Landmarks: 11=Left Shoulder, 12=Right Shoulder, 7=Left Ear, 8=Right Ear
      const leftShoulder = landmarks[11];
      const rightShoulder = landmarks[12];
      const leftEar = landmarks[7];
      const rightEar = landmarks[8];

      // Check Shoulder Alignment (y-axis difference)
      const shoulderDiff = Math.abs(leftShoulder.y - rightShoulder.y);
      const headTilt = Math.abs(leftEar.y - rightEar.y);

      // Thresholds are heuristic and depend on distance, but relative checks work reasonably well
      let isGoodFrame = true;

      if (shoulderDiff > 0.05) {
        issuesDetected.add("Uneven Shoulders");
        isGoodFrame = false;
      }
      if (headTilt > 0.05) {
        issuesDetected.add("Head Tilt");
        isGoodFrame = false;
      }

      if (isGoodFrame) goodPostureFrames++;
    }
  };

  return new Promise((resolve) => {
    const intervalId = setInterval(() => {
        if(videoElement.paused || videoElement.ended) {
            clearInterval(intervalId);
            const score = frameCount > 0 ? Math.round((goodPostureFrames / frameCount) * 100) : 0;
            resolve({
                postureScore: score,
                postureIssues: Array.from(issuesDetected)
            });
        } else {
            processFrame();
        }
    }, 100);
  });
}