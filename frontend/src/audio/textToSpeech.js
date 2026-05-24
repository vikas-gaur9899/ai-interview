let cachedIndianVoice = null;

export const speak = (text, onEnd) => {
  if (!window.speechSynthesis) {
    onEnd && onEnd();
    return;
  }

  window.speechSynthesis.cancel();

  const cleanText = text
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const sentences =
    cleanText.match(/[^.!?]+[.!?]*/g) || [cleanText];

  let index = 0;

  const loadIndianVoice = () => {
    if (cachedIndianVoice) return cachedIndianVoice;

    const voices = window.speechSynthesis.getVoices();

    // 🇮🇳 HARD preference order
    cachedIndianVoice =
      voices.find(v => v.lang === "en-IN") ||        // Indian English
      voices.find(v => v.name.toLowerCase().includes("india")) ||
      voices.find(v => v.lang === "en-GB") ||        // closer than US
      voices.find(v => v.lang.startsWith("en")) ||
      null;

    return cachedIndianVoice;
  };

  const speakNext = () => {
    if (index >= sentences.length) {
      onEnd && onEnd();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(
      sentences[index].trim()
    );

    const voice = loadIndianVoice();

    utterance.voice = voice;
    utterance.lang = voice?.lang || "en-IN";

    // 🎙️ Indian interviewer tuning
    utterance.rate = 0.9;     // Indian pace
    utterance.pitch = 1.0;
    utterance.volume = 1;

    utterance.onend = () => {
      index++;
      setTimeout(speakNext, 250);
    };

    utterance.onerror = () => {
      index++;
      speakNext();
    };

    window.speechSynthesis.speak(utterance);
  };

  // ⛑️ Voice async fix (MANDATORY)
  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      loadIndianVoice();
      speakNext();
    };
  } else {
    loadIndianVoice();
    speakNext();
  }
};
