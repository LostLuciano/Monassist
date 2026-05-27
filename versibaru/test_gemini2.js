const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
  // Menggunakan API Key yang ada di screenshot Anda
  const apiKey = 'AIzaSyDVNONVHfGi8UiTIEvQO1wFaBCZw9J-LJQ';
  
  console.log('Menguji API Key Gemini: ' + apiKey.substring(0, 10) + '...');
  
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
