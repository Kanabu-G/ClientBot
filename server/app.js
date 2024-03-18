const express = require("express");
const openai = require("openai");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

openai.apiKey = process.env.OPENAI_API_KEY;

app.use(express.json()); // Middleware to parse JSON-encoded bodies
app.use(cors({
  origin: 'https://clientbot-9sb8.onrender.com'
}));

async function generateChatbotResponse(userInput) {
  if (!userInput || userInput.trim() === '') {
    throw new Error("User input is empty or invalid");
  }

  try {
    const client = new openai.OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt: userInput,
    });
    const botResponse = response.choices[0].text;
    return botResponse;
  } catch (error) {
    console.error("Error generating chatbot response:", error);
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error.message);
    } else {
      throw new Error("Failed to generate chatbot response. Please try again later.");
    }
  }
}

app.post("/v1/completions", async (req, res) => {
  try {
    const userInput = req.body.userInput; // Extract userInput from request body
    const botResponse = await generateChatbotResponse(userInput);
    res.json({ response: botResponse });
  } catch (error) {
    console.error("Error generating chatbot response:", error);
    res.status(500).json({ error: "Failed to generate chatbot response. Please try again later." });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
