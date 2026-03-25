export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
    try {
        const key = process.env.GEMINI_API_KEY;
        if (!key) return res.status(500).json({ error: { message: "GEMINI_API_KEY não configurada na Vercel." } });

        let { prompt, aspectRatio } = req.body;

        const body = {
            instances: [{ prompt }],
            parameters: { sampleCount: 1, aspectRatio: aspectRatio || '1:1' }
        };

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${key}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const data = await response.json();
        return res.status(200).json(data);
    } catch (e) {
        return res.status(500).json({ error: { message: e.message } });
    }
}
