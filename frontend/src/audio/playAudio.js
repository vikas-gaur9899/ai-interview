let currentAudio = null;
let isPlaying = false;

const BACKEND_BASE_URL =import.meta.env.VITE_BACKEND_URL;

/* ================= PLAY AUDIO ================= */
export const playAudio = (url, onEnd) => {
  if (!url) {
    onEnd && onEnd();
    return;
  }

  // 🔥 Make URL absolute
  const finalUrl = url.startsWith("http")
    ? url
    : `${BACKEND_BASE_URL}${url}`;

  // 🔥 STOP previous audio (important)
  stopAudio();

  const audio = new Audio(finalUrl);
  audio.volume = 1.0;

  currentAudio = audio;
  isPlaying = true;

  audio.onended = () => {
    cleanup();
    onEnd && onEnd();
  };

  audio.onerror = () => {
    console.error("🔊 Audio error");
    cleanup();
    onEnd && onEnd();
  };

  audio.play().catch((err) => {
    console.error("❌ Audio play failed:", err);
    cleanup();
    onEnd && onEnd();
  });
};

/* ================= STOP AUDIO ================= */
export const stopAudio = () => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  isPlaying = false;
};

/* ================= CHECK STATE ================= */
export const isAudioPlaying = () => isPlaying;

/* ================= CLEANUP ================= */
const cleanup = () => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  isPlaying = false;
};
export const playAudioFromText = async (text, onEnd) => {
  try {
    const res = await fetch("http://localhost:5000/api/tts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text })
    });

    const data = await res.json();

    if (!data.audioUrl) {
      throw new Error("No audioUrl from backend");
    }

    playAudio(data.audioUrl, onEnd);

  } catch (err) {
    console.error("TTS fetch failed:", err);
    onEnd && onEnd();
  }
};