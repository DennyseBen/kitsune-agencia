export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
    try {
        const key = process.env.GEMINI_API_KEY;
        if (!key) return res.status(500).json({ error: { message: "GEMINI_API_KEY não configurada na Vercel." } });

        let { prompt, aspectRatio } = req.body;

        // Hidden prompt enhancer
        try {
            const enhanceRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${key}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    systemInstruction: { parts: [{ text: `You are an expert image prompt engineer. Rewrite the user's prompt into a rich, detailed visual scene description in English optimized for photorealistic AI image generation. Rules: describe only visual elements (lighting, colors, textures, composition, camera angle, mood); never use words like ad, advertisement, marketing, promotional, banner, campaign, brand, logo, sale, offer, discount; keep it under 200 words; output only the improved prompt, nothing else.` }] },
                    contents: [{ role: 'user', parts: [{ text: prompt }] }]
                })
            });
            const enhanceData = await enhanceRes.json();
            const enhanced = enhanceData?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (enhanced) prompt = enhanced.trim();
        } catch (_) { /* fallback to original */ }

        // Generate image with gemini-3.1-flash-image-preview
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=${key}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { responseModalities: ['TEXT', 'IMAGE'] }
            })
        });

        const data = await response.json();
        if (data.error) return res.status(500).json({ error: { message: data.error.message } });

        // Extract image part from response
        const parts = data.candidates?.[0]?.content?.parts || [];
        const imgPart = parts.find(p => p.inlineData);
        if (imgPart) {
            return res.status(200).json({
                predictions: [{
                    bytesBase64Encoded: imgPart.inlineData.data,
                    mimeType: imgPart.inlineData.mimeType || 'image/png'
                }]
            });
        }

        return res.status(500).json({ error: { message: 'Nenhuma imagem retornada pelo modelo.' } });
    } catch (e) {
        return res.status(500).json({ error: { message: e.message } });
    }
}
