export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const aiKey = process.env.GEMINI_API_KEY;
        if (!aiKey) {
            return res.status(500).json({
                content: [{ text: "⚠️ ERRO: A variável GEMINI_API_KEY não foi configurada no painel da Vercel." }]
            });
        }

        const { system, messages } = req.body;

        // Converte o formato Anthropic recebido do Front-end para o formato do Gemini
        const geminiContents = messages.map((msg) => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: String(msg.content) }]
        }));

        const payload = {
            contents: geminiContents,
        };

        // Instruction de sistema
        if (system) {
            payload.systemInstruction = {
                parts: [{ text: String(system) }]
            };
        }

        // Chama o Gemini 1.5 Flash (Super rápido para agentes repetitivos)
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${aiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (data.error) {
            return res.status(500).json({
                content: [{ text: `⚠️ ERRO Gemini: ${data.error.message}` }]
            });
        }

        // Pega o texto gerado pelo Gemini e formata como o Frontend (Anthropic) esperava
        const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Erro: Resposta vazia da IA Gemini.';

        return res.status(200).json({
            content: [{ text: replyText }]
        });

    } catch (error) {
        return res.status(500).json({
            content: [{ text: `⚠️ ERRO Backend (Vercel): ${error.message}` }]
        });
    }
}
