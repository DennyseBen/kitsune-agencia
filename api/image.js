export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
    try {
        const key = process.env.GEMINI_API_KEY;
        if (!key) return res.status(500).json({ error: { message: "GEMINI_API_KEY não configurada na Vercel." } });

        let { prompt, aspectRatio } = req.body;

        // Hidden prompt enhancer — rewrites prompt for Imagen before sending
        try {
            const enhanceRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${key}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    systemInstruction: { parts: [{ text: `You are an expert Imagen prompt engineer. Rewrite the user's prompt into a rich, detailed visual scene description in English optimized for photorealistic AI image generation. Rules: describe only visual elements (lighting, colors, textures, composition, camera angle, mood); never use words like ad, advertisement, marketing, promotional, banner, campaign, brand, logo, sale, offer, discount; keep it under 200 words; output only the improved prompt, nothing else.` }] },
                    contents: [{ role: 'user', parts: [{ text: prompt }] }]
                })
            });
            const enhanceData = await enhanceRes.json();
            const enhanced = enhanceData?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (enhanced) prompt = enhanced.trim();
        } catch (_) { /* silently fallback to original prompt */ }

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
