// netlify/functions/generate-profile.js
exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
          return { statusCode: 405, body: 'Method Not Allowed' };
    }
    const headers = {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Content-Type': 'application/json',
    };
    try {
          const { prompt } = JSON.parse(event.body);
          if (!prompt) return { statusCode: 400, headers, body: JSON.stringify({ error: 'No prompt' }) };
          const resp = await fetch('https://api.anthropic.com/v1/messages', {
                  method: 'POST',
                  headers: {
                            'Content-Type': 'application/json',
                            'x-api-key': process.env.ANTHROPIC_API_KEY2 || process.env.ANTHROPIC_API_KEY,
                            'anthropic-version': '2023-06-01',
                  },
                  body: JSON.stringify({
                            model: 'claude-sonnet-4-20250514',
                            max_tokens: 1000,
                            messages: [{ role: 'user', content: prompt }],
                  }),
          });
          const data = await resp.json();
          return { statusCode: 200, headers, body: JSON.stringify(data) };
    } catch (err) {
          return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
    }
};
