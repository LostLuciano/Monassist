const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is missing. Set it in .env before running this script.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await res.json();
    console.log(JSON.stringify(data.models.map(m => m.name), null, 2));
  } catch (err) {
    console.error(err);
  }
}
listModels();
