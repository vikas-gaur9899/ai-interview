import Groq from "groq-sdk";

let groqClient;

const getGroqClient = () => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY missing");
  }

  if (!groqClient) {
    groqClient = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });
  }
// console.log(groqClient);
  return groqClient;
};

export const askLLM = async (prompt) => {
  const groq = getGroqClient();

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant", // ✅ FIXED
    messages: [
      { role: "system", content: "You are a professional interviewer." },
      { role: "user", content: prompt }
    ]
  });
   console.log("hit");
  return completion.choices[0].message.content;
};
