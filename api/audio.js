export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
    try {
        const key = process.env.GEMINI_API_KEY;
        if (!key) return res.status(500).json({ error: 'GEMINI_API_KEY não configurada.' });

        const { audioBase64, mimeType, mode } = req.body;
        if (!audioBase64 || !mimeType) return res.status(400).json({ error: 'audioBase64 e mimeType são obrigatórios.' });

        const prompts = {
            transcribe: 'Transcreva este áudio na íntegra, palavra por palavra. Retorne apenas o texto transcrito, sem comentários.',
            analyze: 'Analise este áudio em detalhes: descreva o conteúdo, identificar quem fala (se possível), tema principal, tom e pontos-chave. Responda em português.',
            both: 'Responda em dois blocos:\n\n**TRANSCRIÇÃO:**\n[transcrição completa palavra por palavra]\n\n**ANÁLISE:**\n[análise do conteúdo, tema, tom, pontos-chave]'
        };

        const prompt = prompts[mode] || prompts.both;

        const payload = {
            contents: [{
                parts: [
                    { text: prompt },
                    { inline_data: { mime_type: mimeType, data: audioBase64 } }
                ]
            }]
        };

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${key}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        if (data.error) return res.status(500).json({ error: data.error.message });

        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        return res.status(200).json({ text });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}
