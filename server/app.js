const express = require("express");
const openai = require("openai");
require("dotenv").config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 3000;

// Set OpenAI API key securely (from environment variable)
openai.apiKey = process.env.OPENAI_API_KEY;

// Endpoint to handle chatbot responses
app.post("/api/chatbot", async (req, res) => {
  try {
    const userInput = req.body.userInput;

    // Get response from OpenAI API
    const response = await openai.createCompletion({
      model: "gpt-3.5-turbo-instruct", // You can adjust the model here
      prompt: userInput,
      max_tokens: 150, // Optional: Limit response length
      ...otherOpenAIOptions // Add other API options if needed
    });

    const botResponse = response.data.choices[0].text;

    // Send response back to client
    res.json({ response: botResponse });
  } catch (error) {
    console.error("Error communicating with OpenAI API:", error);
    res.status(500).json({ error: "Failed to generate response" }); // Send error response
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
