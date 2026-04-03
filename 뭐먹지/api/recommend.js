// api/recommend.js (버셀 서버리스 전용 코드)
export default async function handler(req, res) {
    // POST 요청만 허용
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const userPrompt = req.body.prompt;
    
    // ★ 주의: 코드에 API 키를 직접 적지 않고 버셀의 '환경 변수' 기능을 사용합니다!
    const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;

    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': CLAUDE_API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: "claude-3-haiku-20240307",
                max_tokens: 1000,
                temperature: 0.8,
                messages: [{ role: "user", content: userPrompt }]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            return res.status(response.status).json({ error: errorData });
        }

        const data = await response.json();
        const jsonString = data.content[0].text;
        
        // 프론트엔드로 결과 전송
        res.status(200).json(JSON.parse(jsonString)); 

    } catch (error) {
        console.error("Vercel Server Error:", error);
        res.status(500).json({ message: "서버 통신 중 오류가 발생했습니다." });
    }
}