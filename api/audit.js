const https = require('https');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'No prompt provided' });
  }

  try {
    const body = JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }]
    });

    const result = await new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.anthropic.com',
        path: '/v1/messages',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
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

    return res.status(200).json({ 
      debug: true,
      anthropic_status: result.status,
      anthropic_response: result.body,
      api_key_present: !!process.env.ANTHROPIC_API_KEY,
      api_key_prefix: process.env.ANTHROPIC_API_KEY?.slice(0, 10) + '...'
    });

  } catch(err) {
    return res.status(200).json({ debug: true, error: err.messag
