export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const aiKey = process.env.ANTHROPIC_API_KEY;
        if (!aiKey) {
            return res.status(500).json({
                content: [{ text: "⚠️ ERRO: A variável ANTHROPIC_API_KEY não foi configurada no painel da Vercel." }]
            });
        }

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': aiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({
            content: [{ text: `⚠️ ERRO Backend (Vercel): ${error.message}` }]
        });
    }
}
