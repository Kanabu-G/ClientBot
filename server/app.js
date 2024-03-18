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
  // Check if userInput is empty or invalid
  if (!userInput || userInput.trim() === '') {
    throw new Error("User input is empty or invalid");
  }

  try {
    // Initialize OpenAI API client with your API key
    const client = new openai.OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Make request to OpenAI API to generate chatbot response
    const response = await client.completions.create({
      model: "gpt-3.5-turbo-instruct", // Specify the model
      prompt: userInput,
    });

    // Extract chatbot response from API response
    const botResponse = response.choices[0].text;

    // Return the chatbot response
    return botResponse;
  } catch (error) {
    // Log error for debugging purposes
    console.error("Error generating chatbot response:", error);

    // Throw an error or return a meaningful response based on the specific error
    if (error.response && error.response.data && error.response.data.error) {
      // If the error is from the OpenAI API response, return the error message
      throw new Error(error.response.data.error.message);
    } else {
      // If the error is not from the OpenAI API response, return a generic error message
      throw new Error("Failed to generate chatbot response. Please try again later.");
    }
  }
}

// Route handler for /api/chatbot
app.post("/v1/completions", async (req, res) => {
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
