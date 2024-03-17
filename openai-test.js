const OpenAI = require("openai");

const openai = new OpenAI.default({ apiKey: process.env.OPENAI_API_KEY });

async function main() {
  try {
    const completion = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct", // Use the replacement model
      prompt: "You are a helpful assistant.", // Provide the prompt directly
    });

    console.log(completion.choices[0].text);
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
