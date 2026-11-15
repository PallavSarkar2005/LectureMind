const { generateNotes, answerQuestion } = require("../services/ai.service");

const askQuestion = async (req, res) => {
  try {
    const { text, question } = req.body;

    if (!text || !question) {
      return res.status(400).json({
        success: false,
        message: "Study material and question are required",
      });
    }

    const answer = await answerQuestion(text, question);

    return res.status(200).json({
      success: true,
      message: "Answer generated successfully",
      answer,
    });
  } catch (error) {
    console.error("Chat Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to answer question",
      error: error.message,
    });
  }
};

const createNotes = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Study material is required",
      });
    }

    if (text.length > 50000) {
      return res.status(413).json({
        success: false,
        message: "Study material is too large. Please use a smaller document.",
      });
    }

    const notes = await generateNotes(text);

    return res.status(200).json({
      success: true,
      message: "AI notes generated successfully",
      notes,
    });
  } catch (error) {
    console.error("AI Notes Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate AI notes",
      error: error.message,
    });
  }
};

module.exports = {
  createNotes,
  askQuestion,
};
