import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Dashboard(){
  const [user,setUser]=useState(null)
  const [text,setText]=useState('')
  const [result,setResult]=useState(null)
  const [profile,setProfile]=useState({style:'anxious',goal:'clarity',language:'en'})
  const [loading,setLoading]=useState(false)

  useEffect(()=>{
    supabase.auth.getUser().then(({data})=>{if(data.user) setUser(data.user); else supabase.auth.signInAnonymously()})
  },[])

  async function analyze(){
    setLoading(true)
    const res = await fetch('/api/analyze',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text,userId:user?.id,profile})})
    const data = await res.json()
    setResult(data)
    setLoading(false)
    // save to supabase
    await supabase.from('analyses').insert({user_id:user?.id,input:text,pattern:data.pattern,advice:data.advice})
  }

  return <div style={{maxWidth:900,margin:'40px auto',padding:20}}>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:30}}>
      <img src="/logo.png" height="40"/>
      <div>{user?.email||'Guest'}</div>
    </div>
    
    <div className="card" style={{marginBottom:24}}>
      <h2>Personalize LOYAH</h2>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12,marginTop:12}}>
        <select value={profile.style} onChange={e=>setProfile({...profile,style:e.target.value})}>
          <option value="anxious">Anxious attachment</option>
          <option value="avoidant">Avoidant partner</option>
          <option value="secure">Secure</option>
          <option value="confused">Confused</option>
        </select>
        <select value={profile.goal} onChange={e=>setProfile({...profile,goal:e.target.value})}>
          <option value="clarity">Get clarity</option>
          <option value="decide">Decide stay/leave</option>
          <option value="communicate">Improve communication</option>
          <option value="heal">Heal after breakup</option>
        </select>
        <select value={profile.language} onChange={e=>setProfile({...profile,language:e.target.value})}>
          <option value="en">English</option>
          <option value="it">Italiano</option>
          <option value="es">Español</option>
        </select>
      </div>
    </div>

    <div className="card">
      <h2>New Analysis</h2>
      <textarea rows="5" placeholder="Paste the message or situation..." value={text} onChange={e=>setText(e.target.value)}/>
      <button className="btn" onClick={analyze} disabled={loading}>{loading?'Analyzing...':'Analyze'}</button>
      {result && <div style={{marginTop:20,padding:18,background:'#f7f3ff',borderRadius:12}}>
        <div style={{fontSize:12,color:'#9b7bff',fontWeight:700}}>LOYAH ANALYSIS</div>
        <h3>{result.pattern}</h3>
        <p style={{color:'#5b5b7a'}}>{result.advice}</p>
        {result.nextStep && <p><b>Next step:</b> {result.nextStep}</p>}
      </div>}
    </div>
  </div>
}