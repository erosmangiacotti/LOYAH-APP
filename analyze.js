export default async function handler(req,res){
  const {text,profile}=req.body
  const {style='anxious',goal='clarity',lang='en'}=profile||{}
  const sys=`You are LOYAH, elite relationship analyst. User: ${style} attachment, goal=${goal}. Analyze text for patterns (breadcrumbing, avoidance, love-bombing, gaslighting). Consider user's style. Output JSON: {"pattern":"2-3 words","advice":"1 sentence in ${lang} practical","nextStep":"action","scores":{"availability":0-10,"consistency":0-10,"respect":0-10},"redFlag":bool}. Be honest, kind, no fluff.`
  try{
    const r=await fetch('https://api.openai.com/v1/chat/completions',{
      method:'POST',
      headers:{'Authorization':`Bearer ${process.env.OPENAI_API_KEY}`,'Content-Type':'application/json'},
      body:JSON.stringify({model:'gpt-4o-mini',messages:[{role:'system',content:sys},{role:'user',content:text}],temperature:0.3,response_format:{type:'json_object'}})
    })
    const j=await r.json()
    res.json(JSON.parse(j.choices[0].message.content))
  }catch(e){res.json({pattern:'Soft avoidance',advice:lang==='it'?'Osserva azioni per 7 giorni':'Watch actions for 7 days',nextStep:'Track replies',scores:{availability:5,consistency:4,respect:6},redFlag:false})}
}