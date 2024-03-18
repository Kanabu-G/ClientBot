const express = require("express");
const openai = require("openai");
const cors = require("cors"); // Import CORS middleware
require("dotenv").config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 3000;

// Set OpenAI API key securely (from environment variable)
openai.apiKey = process.env.OPENAI_API_KEY;

// Use CORS middleware to allow requests only from your client-side origin
app.use(cors({
  origin: 'https://clientbot-9sb8.onrender.com' // Replace with your client-side origin
}));

// Function to interact with the OpenAI API and generate chatbot response
async function generateChatbotResponse(userInput) {
  if (!userInput || userInput.trim() === '') {
    throw new Error("User input is empty or invalid");
  }

  try {
    const completion = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt: userInput,
    });
    return completion.choices[0].text;
  } catch (error) {
    throw new Error("Failed to generate chatbot response from OpenAI API: " + error.message);
  }
}

// Route handler for /api/chatbot
app.post("/api/chatbot", async (req, res) => {
  try {
    const userInput = req.body.userInput;
    const botResponse = await generateChatbotResponse(userInput);
    res.json({ response: botResponse });
  } catch (error) {
    console.error("Error generating chatbot response:", error);
    res.status(500).json({ error: "Failed to generate chatbot response. Please try again later." });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
