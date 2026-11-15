const OpenAI = require("openai");

const apiKey = process.env.OPENROUTER_API_KEY?.trim();

console.log("API key exists:", Boolean(apiKey));
console.log("API key length:", apiKey?.length);
console.log("API key prefix valid:", apiKey?.startsWith("sk-or-v1-"));

if (!apiKey) {
  throw new Error("OPENROUTER_API_KEY is missing");
}

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: apiKey,
});

const answerQuestion = async (text, question) => {
  const response = await client.chat.completions.create({
    model: process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini",

    messages: [
      {
        role: "system",
        content: `You are LectureMind, an educational AI tutor.

Answer the student's questions using the provided study material.

Rules:
1. Explain concepts in simple language.
2. Use examples wherever appropriate.
3. Keep answers structured and understandable.
4. If the answer is not available in the material,
   clearly tell the student.
5. Do not invent information.`,
      },
      {
        role: "user",
        content: `Study Material:
${text}

Student Question:
${question}`,
      },
    ],

    temperature: 0.5,
    max_tokens: 1200,
  });

  return response.choices[0].message.content;
};

// Generate study notes using AI
const generateNotes = async (text) => {
  const response = await client.chat.completions.create({
    model: process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini",

    messages: [
      {
        role: "system",
        content: `You are an expert educational AI tutor.

Generate university examination notes from the
provided study material.

Requirements:
1. Use clear headings and subheadings.
2. Explain concepts in simple language.
3. Include important definitions.
4. Use bullet points.
5. Include relevant examples.
6. Highlight important concepts.
7. End with a quick revision summary.
8. Do not invent information absent from the source.`,
      },
      {
        role: "user",
        content: `Generate study notes from this material:\n\n${text}`,
      },
    ],

    temperature: 0.5,
    max_tokens: 1800,
  });

  return response.choices[0].message.content;
};

module.exports = {
  generateNotes,
  answerQuestion,
};
