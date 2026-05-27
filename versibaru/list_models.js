const { GoogleGenerativeAI } = require('@google/generative-ai');
async function listModels() {
  const apiKey = 'AIzaSyDVNONVHfGi8UiTIEvQO1wFaBCZw9J-LJQ';
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
