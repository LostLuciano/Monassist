const MODEL_OPTIONS = {
  text: {
    google: [
      { id: 'gemini-3.7-flash', label: 'Gemini 3.7 Flash' },
      { id: 'gemini-3.5-flash-lite', label: 'Gemini 3.5 Flash-Lite' },
      { id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash' }
    ],
    groq: [
      { id: 'openai/gpt-oss-120b', label: 'GPT-OSS 120B' },
      { id: 'openai/gpt-oss-20b', label: 'GPT-OSS 20B' },
      { id: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B Versatile' }
    ],
    openrouter: [
      { id: 'google/gemini-3.7-flash', label: 'Gemini 3.7 Flash' },
      { id: 'google/gemini-3.5-flash-lite', label: 'Gemini 3.5 Flash-Lite' },
      { id: 'google/gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
      { id: 'meta-llama/llama-3.3-70b-instruct', label: 'Llama 3.3 70B Instruct' }
    ]
  },
  vision: {
    google: [
      { id: 'gemini-3.7-flash', label: 'Gemini 3.7 Flash' },
      { id: 'gemini-3.5-flash-lite', label: 'Gemini 3.5 Flash-Lite' },
      { id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash' }
    ],
    openrouter: [
      { id: 'google/gemini-3.7-flash', label: 'Gemini 3.7 Flash' },
      { id: 'google/gemini-3.5-flash-lite', label: 'Gemini 3.5 Flash-Lite' },
      { id: 'google/gemini-2.5-flash', label: 'Gemini 2.5 Flash' }
    ]
  }
};

const DEFAULT_TEXT_PROVIDER = 'google';
const DEFAULT_TEXT_MODEL = 'gemini-3.7-flash';
const DEFAULT_VISION_PROVIDER = 'google';
const DEFAULT_VISION_MODEL = 'gemini-3.7-flash';

const hasKey = (value) => Boolean(value && !String(value).includes('xxxx') && !String(value).includes('replace_with'));

const getProviderKey = (provider) => {
  if (provider === 'google') return process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
  if (provider === 'groq') return process.env.GROQ_API_KEY;
  if (provider === 'openrouter') return process.env.OPENROUTER_API_KEY;
  return null;
};

const providerSupportsTask = (provider, task) => Boolean(MODEL_OPTIONS[task]?.[provider]);

const getFallbackConfig = (task) => {
  if (task === 'vision') {
    if (hasKey(getProviderKey('google'))) return { provider: 'google', model: DEFAULT_VISION_MODEL };
    if (hasKey(getProviderKey('openrouter'))) return { provider: 'openrouter', model: 'google/gemini-3.7-flash' };
    return { provider: DEFAULT_VISION_PROVIDER, model: DEFAULT_VISION_MODEL };
  }

  if (hasKey(getProviderKey('google'))) return { provider: 'google', model: DEFAULT_TEXT_MODEL };
  if (hasKey(getProviderKey('groq'))) return { provider: 'groq', model: 'openai/gpt-oss-120b' };
  if (hasKey(getProviderKey('openrouter'))) return { provider: 'openrouter', model: 'google/gemini-3.7-flash' };
  return { provider: DEFAULT_TEXT_PROVIDER, model: DEFAULT_TEXT_MODEL };
};

const normalizeConfig = (settings = {}, task = 'text') => {
  const fallback = getFallbackConfig(task);
  const providerKey = task === 'vision' ? 'ai_vision_provider' : 'ai_text_provider';
  const modelKey = task === 'vision' ? 'ai_vision_model' : 'ai_text_model';
  const requestedProvider = settings[providerKey] || fallback.provider;
  const provider = providerSupportsTask(requestedProvider, task) ? requestedProvider : fallback.provider;
  const options = MODEL_OPTIONS[task][provider] || [];
  const requestedModel = settings[modelKey] || fallback.model;
  const model = options.some((option) => option.id === requestedModel) ? requestedModel : (options[0]?.id || fallback.model);

  return { provider, model };
};

const buildDataUrl = (image) => {
  if (!image) return null;
  return `data:${image.mimeType || 'image/jpeg'};base64,${image.data}`;
};

const callGoogle = async ({ model, prompt, image }) => {
  const apiKey = getProviderKey('google');
  if (!hasKey(apiKey)) throw new Error('Google/Gemini API key belum dikonfigurasi.');

  const input = image
    ? [
        { type: 'text', text: prompt },
        {
          type: 'image',
          data: image.data,
          mime_type: image.mimeType || 'image/jpeg'
        }
      ]
    : [{ type: 'text', text: prompt }];

  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/interactions', {
    method: 'POST',
    headers: {
      'x-goog-api-key': apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ model, input })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google request gagal: ${response.status} ${errorText.slice(0, 200)}`);
  }

  const data = await response.json();
  return data.output_text || data.output?.[0]?.content?.[0]?.text || '';
};

const callOpenAICompatible = async ({ provider, model, prompt, image }) => {
  const apiKey = getProviderKey(provider);
  if (!hasKey(apiKey)) throw new Error(`${provider} API key belum dikonfigurasi.`);

  const baseUrl = provider === 'groq'
    ? 'https://api.groq.com/openai/v1/chat/completions'
    : 'https://openrouter.ai/api/v1/chat/completions';

  const content = image
    ? [
        { type: 'text', text: prompt },
        { type: 'image_url', image_url: { url: buildDataUrl(image) } }
      ]
    : prompt;

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  };

  if (provider === 'openrouter') {
    headers['HTTP-Referer'] = process.env.FRONTEND_URL || 'https://moneyassist.netlify.app';
    headers['X-Title'] = 'MoneyAssist';
  }

  const response = await fetch(baseUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content }],
      temperature: 0.2
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`${provider} request gagal: ${response.status} ${errorText.slice(0, 200)}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
};

const generateText = async ({ prompt, settings }) => {
  const config = normalizeConfig(settings, 'text');
  if (config.provider === 'google') {
    return callGoogle({ model: config.model, prompt });
  }
  return callOpenAICompatible({ provider: config.provider, model: config.model, prompt });
};

const generateVision = async ({ prompt, image, settings }) => {
  const config = normalizeConfig(settings, 'vision');
  if (config.provider === 'google') {
    return callGoogle({ model: config.model, prompt, image });
  }
  return callOpenAICompatible({ provider: config.provider, model: config.model, prompt, image });
};

const cleanJsonText = (text) => {
  const cleaned = String(text || '').trim().replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim();
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return cleaned.slice(firstBrace, lastBrace + 1);
  }
  return cleaned;
};

const parseJsonResponse = (text) => JSON.parse(cleanJsonText(text));

module.exports = {
  MODEL_OPTIONS,
  DEFAULT_TEXT_PROVIDER,
  DEFAULT_TEXT_MODEL,
  DEFAULT_VISION_PROVIDER,
  DEFAULT_VISION_MODEL,
  generateText,
  generateVision,
  parseJsonResponse,
  normalizeConfig,
  getFallbackConfig
};
