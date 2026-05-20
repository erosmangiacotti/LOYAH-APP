import {useState} from 'react'
export default function Home(){
  const [text,setText]=useState('')
  const [profile,setProfile]=useState({style:'anxious',goal:'clarity',lang:'en'})
  const [res,setRes]=useState(null)
  const [load,setLoad]=useState(false)

  async function analyze(){
    setLoad(true)
    const r=await fetch('/api/analyze',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text,profile})})
    const d=await r.json()
    setRes(d); setLoad(false)
    const hist=JSON.parse(localStorage.getItem('loyah')||'[]'); hist.unshift({t:Date.now(),...d,input:text}); localStorage.setItem('loyah',JSON.stringify(hist.slice(0,20)))
  }

  return <div style={{fontFamily:'system-ui',background:'linear-gradient(#fdfcff,#f6f1ff)',minHeight:'100vh',color:'#1d1b2f'}}>
    <div style={{maxWidth:900,margin:'0 auto',padding:24}}>
      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:30}}>
        <img src="/logo.png" height="44"/>
      </div>
      
      <div style={{background:'white',padding:28,borderRadius:20,boxShadow:'0 12px 30px rgba(155,123,255,.12)',marginBottom:20}}>
        <h2 style={{marginTop:0}}>Personalize</h2>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12}}>
          <select value={profile.style} onChange={e=>setProfile({...profile,style:e.target.value})} style={s}>
            <option value="anxious">Anxious</option><option value="avoidant">Avoidant partner</option><option value="secure">Secure</option><option value="confused">Confused</option>
          </select>
          <select value={profile.goal} onChange={e=>setProfile({...profile,goal:e.target.value})} style={s}>
            <option value="clarity">Get clarity</option><option value="decide">Decide</option><option value="communicate">Communicate better</option><option value="heal">Heal</option>
          </select>
          <select value={profile.lang} onChange={e=>setProfile({...profile,lang:e.target.value})} style={s}>
            <option value="en">English</option><option value="it">Italiano</option><option value="es">Español</option>
          </select>
        </div>
      </div>

      <div style={{background:'white',padding:28,borderRadius:20,boxShadow:'0 12px 30px rgba(155,123,255,.12)'}}>
        <h1 style={{fontFamily:'Georgia',marginTop:0}}>New Analysis</h1>
        <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Paste message..." style={{...s,height:120}}/>
        <button onClick={analyze} disabled={load||!text} style={{background:'linear-gradient(135deg,#9b7bff,#b18aff)',color:'white',border:0,padding:'14px 28px',borderRadius:12,fontWeight:700,marginTop:12,cursor:'pointer',opacity:load?0.6:1}}>
          {load?'Analyzing...':'Analyze'}
        </button>
        {res && <div style={{marginTop:20,padding:20,background:'#f7f3ff',borderRadius:12}}>
          <div style={{color:'#9b7bff',fontWeight:700,fontSize:12}}>PATTERN</div>
          <h3 style={{margin:'6px 0'}}>{res.pattern}</h3>
          <p style={{color:'#5b5b7a'}}>{res.advice}</p>
          {res.scores && <div style={{display:'flex',gap:16,marginTop:12}}>
            <div>Availability: <b>{res.scores.availability}/10</b></div>
            <div>Consistency: <b>{res.scores.consistency}/10</b></div>
            <div>Respect: <b>{res.scores.respect}/10</b></div>
          </div>}
          {res.nextStep && <p style={{marginTop:12}}><b>Next:</b> {res.nextStep}</p>}
        </div>}
      </div>
    </div>
  </div>
}
const s={padding:'12px',border:'1px solid #e5d9ff',borderRadius:10,fontSize:15,width:'100%'}
