const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is missing. Set it in .env before running this script.');
  }
  
  console.log('Menguji koneksi Gemini...');
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
    
    const prompt = 'Halo, sebutkan angka 1 sampai 3.';
    const result = await model.generateContent(prompt);
    
    console.log('✅ SUKSES! Respons dari Gemini:');
    console.log(result.response.text());
  } catch (error) {
    console.error('❌ GAGAL! Error dari Gemini:');
    console.error(error.message);
  }
}

testGemini();
