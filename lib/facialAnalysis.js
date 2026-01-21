// Suppress specific TF Lite info messages that are logged as errors
const originalConsoleError = console.error;
console.error = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('TensorFlow Lite XNNPACK delegate')) {
    return;
  }
  originalConsoleError(...args);
};

let faceLandmarker;
let runningMode = "VIDEO";

const BLENDSHAPES = {
  SMILE: ["mouthSmileLeft", "mouthSmileRight"],
  NERVOUS: ["browDownLeft", "browDownRight", "jawOpen"],
};

// Initialize the landmarker
async function createFaceLandmarker() {
  const { FaceLandmarker, FilesetResolver } = await import("@mediapipe/tasks-vision");
  const filesetResolver = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
  );
  faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
    baseOptions: {
      modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
      delegate: "GPU"
    },
    outputFaceBlendshapes: true,
    runningMode,
    numFaces: 1
  });
  console.log("Face landmarker created");
}

export async function analyzeFacialCues(videoElement) {
  if (!faceLandmarker) {
    console.log("Waiting for landmarker to be created");
    await createFaceLandmarker();
    if(!faceLandmarker) {
        console.error("FaceLandmarker not created after wait.");
        return null;
    }
  }

  let happyScore = 0;
  let nervousScore = 0;
  let frameCount = 0;

  const processFrame = async () => {
    if (videoElement.readyState < 2) return;

    let results;
    try {
      const startTimeMs = performance.now();
      results = faceLandmarker.detectForVideo(videoElement, startTimeMs);
    } catch (e) {
      return;
    }

    frameCount++;

    if (results.faceBlendshapes && results.faceBlendshapes.length > 0) {
      const blendshapes = results.faceBlendshapes[0].categories;
      
      // Calculate smile score
      const smile = blendshapes.filter(c => BLENDSHAPES.SMILE.includes(c.categoryName))
                               .reduce((acc, c) => acc + c.score, 0) / 2;
      
      // Calculate nervous score
      const nervous = blendshapes.filter(c => BLENDSHAPES.NERVOUS.includes(c.categoryName))
                                 .reduce((acc, c) => acc + c.score, 0) / 3;

      if(smile > 0.3) happyScore++;
      if(nervous > 0.2) nervousScore++;

      // Log blendshape data for debugging
      // console.log("Blendshape Data:", {
      //   smile,
      //   nervous,
      //   browDownLeft: blendshapes.find(c => c.categoryName === "browDownLeft")?.score,
      //   browDownRight: blendshapes.find(c => c.categoryName === "browDownRight")?.score,
      //   jawOpen: blendshapes.find(c => c.categoryName === "jawOpen")?.score,
      //   eyeBlinkLeft: blendshapes.find(c => c.categoryName === "eyeBlinkLeft")?.score,
      //   eyeBlinkRight: blendshapes.find(c => c.categoryName === "eyeBlinkRight")?.score,
      //   mouthSmileLeft: blendshapes.find(c => c.categoryName === "mouthSmileLeft")?.score,
      //   mouthSmileRight: blendshapes.find(c => c.categoryName === "mouthSmileRight")?.score,
      // });
    } else {
      // console.log("No face blendshapes detected in this frame.");
    }
  }

  return new Promise((resolve) => {
    const startAnalysis = () => {
        const intervalId = setInterval(() => {
            if(videoElement.paused || videoElement.ended) {
                clearInterval(intervalId);

                let dominantEmotion = "neutral";
                if (frameCount > 0) {
                  if(happyScore / frameCount > 0.2) dominantEmotion = "happy";
                  else if (nervousScore / frameCount > 0.15) dominantEmotion = "nervous";
                }
                
                // TODO: Implement more sophisticated eye contact analysis
                const eyeContact = "good"; 

                resolve({
                    dominantEmotion,
                    eyeContact
                });
                return;
            }
            processFrame();
        }, 100); // process 10 frames per second
    };

    if (!videoElement.paused && !videoElement.ended && videoElement.currentTime > 0) {
        startAnalysis();
    } else {
        videoElement.onplay = startAnalysis;
        videoElement.play();
    }
  });
}
