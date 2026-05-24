let recognition = null;
let isListening = false;

export const listen = (onResult) => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Speech recognition not supported");
    return;
  }

  // create instance once
  if (!recognition) {
    recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = true;
    recognition.interimResults = true;
  }

  // 🔥 ALWAYS UPDATE CALLBACK
  recognition.onresult = (event) => {
    let transcript = "";

    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }

    console.log("VOICE:", transcript);
    onResult(transcript);
  };

  recognition.onerror = (err) => {
    console.log("Speech error:", err.error);
  };

  recognition.onend = () => {
    if (isListening) {
      try {
        recognition.start();
      } catch {}
    }
  };

  isListening = true;

  try {
    recognition.start();
  } catch (e) {
    console.log("Start error:", e);
  }
};

export const stopListening = () => {
  isListening = false;
  if (recognition) {
    try {
      recognition.stop();
    } catch {}
  }
};