const https = require('https');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  let prompt;
  try {
    const bodyData = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    prompt = bodyData?.prompt;
  } catch(e) {
    return res.status(400).json({ error: 'Could not parse request body: ' + e.message });
  }

  if (!prompt) return res.status(400).json({ error: 'No prompt provided' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' });

  try {
    const body = JSON.stringify({
      model: 'claude-sonnet-4-5',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }]
    });

    const result = await new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.anthropic.com',
        path: '/v1/messages',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'Content-Length': Buffer.byteLength(body)
        }
      };

      const reqHttp = https.request(options, (response) => {
        let data = '';
        response.on('data', chunk => { data += chunk; });
        response.on('end', () => resolve({ status: response.statusCode, body: data }));
      });

      reqHttp.on('error', reject);
      reqHttp.write(body);
      reqHttp.end();
    });

    const parsed = JSON.parse(result.body);
    if (result.status !== 200) {
      return res.status(200).json({ error: parsed.error?.message || 'Anthropic error', anthropic_status: result.status });
    }

    const text = parsed.content?.map(b => b.text || '').join('') || '';
    return res.status(200).json({ result: text });

  } catch(err) {
    return res.status(200).json({ error: 'Caught error: ' + err.message });
  }
};
