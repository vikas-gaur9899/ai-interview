import {
  useNavigate,
  useParams
} from "react-router-dom";

import {
  useEffect,
  useRef,
  useState
} from "react";

import Navbar from "./Navbar";

import {
  listen,
  stopListening
} from "../audio/speechToText";

import {

  playAudio,
  stopAudio,
  playAudioFromText

} from "../audio/playAudio";

import API from "../api/api";

/* ====================================================
   INTERVIEW ROOM
==================================================== */

export default function InterviewRoom() {

  const navigate =
    useNavigate();

  /* ====================================================
     GET TOKEN FROM URL
  ==================================================== */

  const { token } =
    useParams();

  /* ====================================================
     REFS
  ==================================================== */

  const videoRef =
    useRef(null);

  const streamRef =
    useRef(null);

  const timerRef =
    useRef(null);

  const questionTimerRef =
    useRef(null);

  const finalizedRef =
    useRef(false);

  const isProcessingRef =
    useRef(false);

  const silence20Ref =
    useRef(null);

  const silence40Ref =
    useRef(null);

  const silence60Ref =
    useRef(null);

  const hasUserClickedSpeakRef =
    useRef(false);

  /* ====================================================
     LOCAL STORAGE DATA
  ==================================================== */

  const studentId =
    localStorage.getItem(
      "studentId"
    );

  /* ====================================================
     STATES
  ==================================================== */

  const [interviewId, setInterviewId] =
    useState(null);

  const [question, setQuestion] =
    useState("");

  const [audioUrl, setAudioUrl] =
    useState("");

  const [answer, setAnswer] =
    useState("");

  const [code, setCode] =
    useState("");

  const [interviewType, setInterviewType] =
    useState("technical");

  const [aiSpeaking, setAiSpeaking] =
    useState(true);

  const [isListening, setIsListening] =
    useState(false);

  const [timeLeft, setTimeLeft] =
    useState(900);

  /* ====================================================
     BLOCK BACK BUTTON
     — push a dummy state immediately, then keep
       pushing on every popstate so the user can
       never actually go back
  ==================================================== */

  useEffect(() => {

    // push TWO entries so there is always one to pop back to
    window.history.pushState(null, "", window.location.href);
    window.history.pushState(null, "", window.location.href);

    const blockBack = () => {
      // immediately push again so the stack never empties
      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", blockBack);

    return () => {
      window.removeEventListener("popstate", blockBack);
    };

  }, []);

  /* ====================================================
     BLOCK PAGE REFRESH / CLOSE
  ==================================================== */

  useEffect(() => {

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      // Both lines are needed for cross-browser support
      e.returnValue = "Interview is in progress. Are you sure you want to leave?";
      return e.returnValue;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };

  }, []);

  /* ====================================================
     FULLSCREEN
     — browsers block requestFullscreen unless it is
       called from a real user gesture.
       We listen for the first click/keydown anywhere
       on the page and enter fullscreen then.
  ==================================================== */

  useEffect(() => {

    const enterFullscreen = async () => {
      try {
        if (
          !document.fullscreenElement &&
          document.documentElement.requestFullscreen
        ) {
          await document.documentElement.requestFullscreen();
        }
      } catch (err) {
        console.log("Fullscreen failed:", err.message);
      }
    };

    // Try immediately (works if user navigated via a click)
    enterFullscreen();

    // Also try on first user interaction as fallback
    const onFirstInteraction = () => {
      enterFullscreen();
      document.removeEventListener("click", onFirstInteraction);
      document.removeEventListener("keydown", onFirstInteraction);
    };

    document.addEventListener("click", onFirstInteraction);
    document.addEventListener("keydown", onFirstInteraction);

    return () => {
      document.removeEventListener("click", onFirstInteraction);
      document.removeEventListener("keydown", onFirstInteraction);
    };

  }, []);

  /* ====================================================
     FULLSCREEN EXIT DETECTION
     — warn the user and try to re-enter
  ==================================================== */

  useEffect(() => {

    const handleFullscreenChange = async () => {
      if (!document.fullscreenElement) {
        console.log("⚠ FULLSCREEN EXIT DETECTED");

        await playAudioFromText(
          "Fullscreen mode is required during interview."
        );

        // Try to re-enter fullscreen
        try {
          await document.documentElement.requestFullscreen();
        } catch (err) {
          console.log("Re-enter fullscreen failed:", err.message);
        }
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };

  }, []);

  /* ====================================================
     TAB SWITCH DETECTION
  ==================================================== */

  useEffect(() => {

    const handleVisibility = async () => {
      if (document.hidden) {
        console.log("⚠ TAB SWITCH DETECTED");

        await playAudioFromText(
          "Tab switching is not allowed during interview."
        );
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };

  }, []);

  /* ====================================================
     DISABLE COPY / PASTE / CUT
  ==================================================== */

  useEffect(() => {

    const prevent = (e) => { e.preventDefault(); };

    document.addEventListener("copy",  prevent);
    document.addEventListener("paste", prevent);
    document.addEventListener("cut",   prevent);

    return () => {
      document.removeEventListener("copy",  prevent);
      document.removeEventListener("paste", prevent);
      document.removeEventListener("cut",   prevent);
    };

  }, []);

  /* ====================================================
     DISABLE RIGHT CLICK
  ==================================================== */

  useEffect(() => {

    const disableRightClick = (e) => { e.preventDefault(); };

    document.addEventListener("contextmenu", disableRightClick);

    return () => {
      document.removeEventListener("contextmenu", disableRightClick);
    };

  }, []);

  /* ====================================================
     DEVTOOLS DETECTION
  ==================================================== */

  useEffect(() => {

    const detectDevTools = setInterval(() => {
      if (
        window.outerWidth  - window.innerWidth  > 160 ||
        window.outerHeight - window.innerHeight > 160
      ) {
        console.log("⚠ DEVTOOLS DETECTED");
      }
    }, 1000);

    return () => { clearInterval(detectDevTools); };

  }, []);

  /* ====================================================
     AI SPEAKING
  ==================================================== */

  const startAiSpeaking = () => {
    console.log("🤖 AI SPEAKING STARTED");
    setAiSpeaking(true);
  };

  const stopAiSpeaking = () => {
    console.log("✅ AI SPEAKING STOPPED");
    setAiSpeaking(false);
  };

  /* ====================================================
     START CAMERA
  ==================================================== */

  useEffect(() => {

    const startCamera = async () => {
      try {
        console.log("📷 STARTING CAMERA...");

        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });

        console.log("✅ CAMERA STARTED");
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          console.log("🎥 VIDEO PLAYING");
        }

      } catch (err) {
        console.error("❌ CAMERA ERROR:", err);
      }
    };

    startCamera();

    return () => {
      console.log("🛑 STOPPING CAMERA");
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };

  }, []);

  /* ====================================================
     START INTERVIEW
  ==================================================== */

  useEffect(() => {

    const startInterview = async () => {
      try {
        console.log("🚀 STARTING INTERVIEW...");
        console.log({ studentId, token });

        const res = await API.post("/interview/start", { studentId, token });

        console.log("📦 START RESPONSE:", res.data);

        setInterviewId(res.data.interviewId);
        setAudioUrl(res.data.audioUrl);
        setInterviewType(res.data.interviewType || "technical");

        startQuestionTimer(res.data.interviewType);
        stopListening();
        stopSilenceTimers();
        startAiSpeaking();

        if (res.data.audioUrl) {

          setTimeout(() => {
            playAudio(res.data.audioUrl);
            setQuestion(res.data.question);

            setTimeout(() => {
              stopAiSpeaking();

              if (
                res.data.interviewType === "hr" ||
                res.data.interviewType === "technical"
              ) {
                startSilenceTimers();
              }

            }, 5000);

          }, 700);

        } else {
          setQuestion(res.data.question);
          stopAiSpeaking();
        }

      } catch (err) {
        console.error("❌ START INTERVIEW ERROR:", err);
      }
    };

    startInterview();

  }, []);

  /* ====================================================
     GLOBAL TIMER
  ==================================================== */

  useEffect(() => {

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          finishInterview();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => { clearInterval(timerRef.current); };

  }, []);

  /* ====================================================
     QUESTION TIMER
  ==================================================== */

  const startQuestionTimer = (type) => {

    clearTimeout(questionTimerRef.current);

    if (type === "technical") {
      questionTimerRef.current = setTimeout(() => {
        if (!isProcessingRef.current) skipQuestion();
      }, 180000);
    }

    if (type === "practical") {
      questionTimerRef.current = setTimeout(() => {
        if (!isProcessingRef.current) skipQuestion();
      }, 300000);
    }

  };

  /* ====================================================
     START SILENCE TIMERS
  ==================================================== */

  const startSilenceTimers = () => {

    if (
      interviewType !== "hr" &&
      interviewType !== "technical"
    ) return;

    stopSilenceTimers();

    silence20Ref.current = setTimeout(async () => {
      if (hasUserClickedSpeakRef.current) return;
      setAiSpeaking(true);
      await playAudioFromText("Take your time, you can think and answer.");
      setAiSpeaking(false);
    }, 20000);

    silence40Ref.current = setTimeout(async () => {
      if (hasUserClickedSpeakRef.current) return;
      setAiSpeaking(true);
      await playAudioFromText("Do you want to skip this question?");
      setAiSpeaking(false);
    }, 40000);

    silence60Ref.current = setTimeout(() => {
      if (
        !hasUserClickedSpeakRef.current &&
        !isProcessingRef.current
      ) {
        skipQuestion();
      }
    }, 60000);

  };

  /* ====================================================
     STOP SILENCE TIMERS
  ==================================================== */

  const stopSilenceTimers = () => {
    clearTimeout(silence20Ref.current);
    clearTimeout(silence40Ref.current);
    clearTimeout(silence60Ref.current);
  };

  /* ====================================================
     SPEAK ANSWER
  ==================================================== */

  const speakAnswer = async () => {

    if (aiSpeaking || isProcessingRef.current) return;

    hasUserClickedSpeakRef.current = true;

    stopAudio();
    stopListening();
    stopSilenceTimers();
    setIsListening(true);

    await navigator.mediaDevices.getUserMedia({ audio: true });

    setTimeout(() => {
      listen((text) => {
        if (!text) return;
        console.log("🗣 SPEECH:", text);
        setAnswer(text);
      });
    }, 400);

  };

  /* ====================================================
     SUBMIT ANSWER
  ==================================================== */

  const submitAnswer = async () => {

    if (isProcessingRef.current || !interviewId) return;

    isProcessingRef.current = true;

    try {

      stopListening();
      setIsListening(false);
      stopSilenceTimers();
      clearTimeout(questionTimerRef.current);
      startAiSpeaking();

      // practical -> code | hr/technical -> speech
      const payload =
        interviewType === "practical"
          ? { interviewId, answer: code    || "__EMPTY__" }
          : { interviewId, answer: answer  || "__EMPTY__" };

      const res = await API.post("/interview/answer", payload);

      if (res.data.completed) return finishInterview();

      setAnswer("");
      setCode("");
      hasUserClickedSpeakRef.current = false;

      setTimeout(() => {

        setAudioUrl(res.data.audioUrl);
        setInterviewType(res.data.interviewType || "technical");
        startQuestionTimer(res.data.interviewType);

        if (res.data.audioUrl) {

          setTimeout(() => {
            playAudio(res.data.audioUrl);
            setQuestion(res.data.question);

            setTimeout(() => {
              stopAiSpeaking();

              if (
                res.data.interviewType === "hr" ||
                res.data.interviewType === "technical"
              ) {
                startSilenceTimers();
              }

            }, 5000);

          }, 700);

        } else {
          setQuestion(res.data.question);
          stopAiSpeaking();
        }

      }, 1000);

    } catch (err) {
      console.error("❌ SUBMIT ERROR:", err);
    } finally {
      isProcessingRef.current = false;
    }

  };

  /* ====================================================
     SKIP QUESTION
  ==================================================== */

  const skipQuestion = async () => {

    if (isProcessingRef.current || !interviewId) return;

    isProcessingRef.current = true;

    try {

      stopListening();
      setIsListening(false);
      stopSilenceTimers();
      stopAudio();
      clearTimeout(questionTimerRef.current);
      startAiSpeaking();

      const res = await API.post("/interview/answer", {
        interviewId,
        answer: "__SKIPPED__",
        skipped: true
      });

      if (res.data.completed) return finishInterview();

      setAnswer("");
      setCode("");
      hasUserClickedSpeakRef.current = false;

      setTimeout(() => {

        setAudioUrl(res.data.audioUrl);
        setInterviewType(res.data.interviewType || "technical");
        startQuestionTimer(res.data.interviewType);

        if (res.data.audioUrl) {

          setTimeout(() => {
            playAudio(res.data.audioUrl);
            setQuestion(res.data.question);

            setTimeout(() => {
              stopAiSpeaking();

              if (
                res.data.interviewType === "hr" ||
                res.data.interviewType === "technical"
              ) {
                startSilenceTimers();
              }

            }, 5000);

          }, 700);

        } else {
          setQuestion(res.data.question);
          stopAiSpeaking();
        }

      }, 1200);

    } catch (err) {
      console.error("❌ SKIP ERROR:", err);
    } finally {
      isProcessingRef.current = false;
    }

  };

  /* ====================================================
     FINISH INTERVIEW
  ==================================================== */

  const finishInterview = async () => {

    if (finalizedRef.current) return;
    finalizedRef.current = true;

    stopAudio();
    stopListening();
    setIsListening(false);
    stopSilenceTimers();
    clearTimeout(questionTimerRef.current);

    if (interviewId) {
      await API.post("/interview/finalize", { interviewId });
    }

    const name = localStorage.getItem("studentName") || "Candidate";

    await playAudioFromText(
      `${name}, that concludes your interview. Thank you for your time.`
    );

    setTimeout(() => {
      navigate(`/completed/${interviewId}`);
    }, 2000);

  };

  return (
    <>
      <Navbar />

      {/* ====================================================
         LISTENING OVERLAY
      ==================================================== */}

      {isListening && (
        <div className="listening-full-overlay">
          <h2>Listening...</h2>
        </div>
      )}

      {/* ====================================================
         VIDEO SECTION
      ==================================================== */}

      <div className="interview-room-wrapper">

        <div className={`ai-avatar ${aiSpeaking ? "speaking" : ""}`}>
          <img src="/images/male-agent.jpg" alt="AI" />
        </div>

        <video ref={videoRef} autoPlay muted playsInline />

      </div>

      {/* ====================================================
         QUESTION DISPLAY
      ==================================================== */}

      <div className="question-display">

        <p>{question}</p>

        {aiSpeaking && (
          <p className="ai-speaking-text">🎙 AI is asking...</p>
        )}

      </div>

      {/* ====================================================
         HR + TECHNICAL UI  (voice)
      ==================================================== */}

      {(interviewType === "hr" || interviewType === "technical") &&
        !aiSpeaking && (
          <div className="hr-answer-box">
            <p className="hr-answer-text">🎤 Speak your answer clearly</p>
          </div>
      )}

      {/* ====================================================
         PRACTICAL UI  (code editor)
      ==================================================== */}

      {interviewType === "practical" && !aiSpeaking && (

        <div className="practical-layout">

          <div className="practical-sidebar">

            <h3 className="practical-heading">💻 Practical Interview</h3>

            <div className="practical-question-card">{question}</div>

            <div className="practical-timer">
              ⏱ Time Remaining:{" "}
              {Math.floor(timeLeft / 60)}:
              {(timeLeft % 60).toString().padStart(2, "0")}
            </div>

          </div>

          <div className="practical-editor-panel">

            <div className="editor-title">👨‍💻 Code Editor</div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="// Write your code here..."
              className="practical-code-editor"
            />

          </div>

        </div>

      )}

      {/* ====================================================
         CONTROLS
      ==================================================== */}

      <div className="interview-controls-bar">

        <span>
          ⏱ {Math.floor(timeLeft / 60)}:
          {(timeLeft % 60).toString().padStart(2, "0")}
        </span>

        {!aiSpeaking && (
          <>

            <button onClick={skipQuestion}>Skip</button>

            {(interviewType === "hr" || interviewType === "technical") && (
              <button onClick={speakAnswer}>Speak</button>
            )}

            <button onClick={submitAnswer}>Submit</button>

            <button onClick={finishInterview}>End</button>

          </>
        )}

      </div>
    </>
  );

}