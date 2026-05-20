export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).end()
  const {text,userId,profile={}}=req.body
  const {style='confused',goal='clarity',language='en'}=profile

  // Build powerful system prompt
  const systemPrompt = `You are LOYAH, an expert relationship pattern analyst. You combine attachment theory, behavioral psychology, and communication analysis.

USER PROFILE:
- Attachment style: ${style}
- Current goal: ${goal}
- Language: ${language}
- User ID: ${userId}

ANALYSIS FRAMEWORK:
1. Detect patterns (consistency, reciprocity, avoidance, breadcrumbing, love-bombing, gaslighting)
2. Score: emotional availability (0-10), consistency (0-10), respect (0-10)
3. Consider user's attachment style - tailor advice to avoid reinforcing anxiety
4. Be factual, not emotional. No sugar-coating.

OUTPUT FORMAT (strict JSON):
{
  "pattern": "2-3 word label",
  "scores": {"availability":7,"consistency":4,"respect":6},
  "advice": "one practical sentence in ${language}",
  "nextStep": "concrete action for user with ${style} style pursuing ${goal}",
  "redFlag": true/false
}

Rules:
- If user is anxious, give grounding advice, not reassurance-seeking actions
- If avoidant partner detected, suggest space not pursuit
- Always in ${language}
- Be brutally honest but kind`

  try{
    const r = await fetch('https://api.openai.com/v1/chat/completions',{
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':`Bearer ${process.env.OPENAI_API_KEY}`},
      body:JSON.stringify({
        model:'gpt-4o-mini',
        messages:[
          {role:'system',content:systemPrompt},
          {role:'user',content:text}
        ],
        temperature:0.4,
        response_format:{type:'json_object'}
      })
    })
    const data = await r.json()
    const content = JSON.parse(data.choices[0].message.content)
    res.status(200).json(content)
  }catch(e){
    res.status(200).json({pattern:'Soft avoidance',advice:'Observe actions over words for 7 days',nextStep:'Track response times',scores:{availability:5,consistency:4,respect:6},redFlag:false})
  }
}