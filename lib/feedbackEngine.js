export function generateFeedback(data) {
  const feedback = [];
  const recommendations = [];
  let score = 100;

  // Speaking speed
  if (data.wpm !== undefined) {
    if (data.wpm < 100) {
      feedback.push(`📉 **Pacing**: Your speaking speed is ${data.wpm} WPM. This is a bit slow; aim for 120-150 WPM to maintain interest.`);
      score -= 10;
    } else if (data.wpm > 160) {
      feedback.push(`📈 **Pacing**: You are speaking at ${data.wpm} WPM. Slowing down slightly will improve your clarity and articulation.`);
      score -= 10;
    } else {
      feedback.push(`✅ **Pacing**: Excellent cadence! Your speed of ${data.wpm} WPM is professional and engaging.`);
    }
  }

  // Filler words
  if (data.fillerWords !== undefined) {
    if (data.fillerWords > 4) {
      feedback.push(`⚠️ **Fluency**: Detected ${data.fillerWords} filler words (um, uh). These distractions can lower your perceived confidence.`);
      recommendations.push("Practice the 'Pause Method': When you feel a filler coming, simply pause and breathe.");
      score -= 15;
    } else if (data.fillerWords > 1) {
      feedback.push(`ℹ️ **Fluency**: You used a few filler words. Eliminating them completely will make you sound more authoritative.`);
      score -= 5;
    } else {
      feedback.push(`🌟 **Fluency**: Crystal clear! You spoke without relying on filler words.`);
    }
  }

  // Confidence score
  if (data.confidenceScore !== undefined) {
    if (data.confidenceScore < 6) {
      feedback.push(`🛡️ **Confidence**: Your confidence level is low (${data.confidenceScore}/10). You may sound hesitant or unsure.`);
      recommendations.push("Try 'Power Posing' before you speak to boost your hormonal confidence levels.");
      score -= 20;
    } else if (data.confidenceScore < 8) {
      feedback.push(`📊 **Confidence**: You sound moderately confident (${data.confidenceScore}/10). A bit more vocal energy would help.`);
      recommendations.push("Focus on ending sentences with a downward inflection to sound more definitive.");
      score -= 10;
    } else {
      feedback.push(`🔥 **Confidence**: You project strong confidence (${data.confidenceScore}/10). This commands attention and builds trust.`);
    }
  }

  // Tone analysis
  if (data.tone) {
    if (data.tone === "nervous") {
      feedback.push("🎵 **Tone**: Your voice indicates nervousness. This can trigger anxiety in the listener.");
      recommendations.push("Use 'Box Breathing' (inhale 4s, hold 4s, exhale 4s) to calm your nerves.");
      score -= 10;
    } else if (data.tone === "flat") {
      feedback.push("🎵 **Tone**: Your delivery sounds monotone. Vocal variety is key to keeping the audience engaged.");
      recommendations.push("Try emphasizing key verbs and adjectives to add 'color' to your speech.");
      score -= 10;
    } else if (data.tone === "confident") {
      feedback.push("🎵 **Tone**: Your tone is warm, resonant, and assured. Great job.");
    }
  }

  // Facial Emotion Analysis
  if (data.dominantEmotion) {
    if (data.dominantEmotion === "nervous") {
      feedback.push("😟 **Facial Expressions**: You appear slightly nervous. Try to relax your facial muscles and smile naturally.");
      score -= 10;
    } else if (data.dominantEmotion === "happy") {
      feedback.push("😊 **Facial Expressions**: Great job! You maintained a positive and approachable expression.");
    } else if (data.dominantEmotion === "neutral") {
      feedback.push("😐 **Facial Expressions**: Your expression was mostly neutral. Depending on the context, a warm smile can be more engaging.");
    }
  }

  // Eye Contact
  if (data.eyeContact) {
    if (data.eyeContact === "good") {
      feedback.push("👁️ **Eye Contact**: Good eye contact detected. This shows confidence and attentiveness.");
    } else if (data.eyeContact === "poor") {
      feedback.push("👀 **Eye Contact**: It seems you were looking away often. Maintain steady eye contact to build trust.");
      score -= 10;
    }
  }

  // Posture Analysis
  if (data.postureScore !== undefined) {
    if (data.postureScore < 70) {
      feedback.push("🧘 **Posture**: Your posture seems a bit relaxed or uneven. Sit up straight to project authority.");
      score -= 15;
    } else {
      feedback.push("✅ **Posture**: Great posture! You look confident and engaged.");
    }
  }

  if (data.postureIssues && data.postureIssues.length > 0) {
    if (data.postureIssues.includes("Head Tilt")) {
      recommendations.push("Keep your head level to appear more balanced and focused.");
    }
    if (data.postureIssues.includes("Uneven Shoulders")) {
      recommendations.push("Check your shoulders - keep them level and relaxed, not hunched.");
    }
  }

  // Duration check
  if (data.duration !== undefined && data.duration < 20) {
      feedback.push("⏱️ **Duration**: Your response was very brief. Elaborating shows depth of thought.");
      recommendations.push("Use the PREP framework (Point, Reason, Example, Point) to structure your answers.");
      score -= 5;
  }

  // Personality-based suggestion
  if (data.personality === "introvert") {
    recommendations.push("🧠 **Coach Tip**: Leverage your natural listening skills. Pause to formulate deep insights before speaking.");
  } else if (data.personality === "ambivert") {
    recommendations.push("🧠 **Coach Tip**: Balance your practice. If you feel low energy, push for volume. If high, focus on structure.");
  } else if (data.personality === "extrovert") {
    recommendations.push("🧠 **Coach Tip**: Your energy is a superpower. Ensure you leave space for clarity and don't rush.");
  }

  return {
    feedback,
    recommendations,
    overallScore: Math.max(0, score)
  };
}
