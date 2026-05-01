'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ProfileCard({ user }: { user: any }) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(user?.name || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const initials = (name||'?').split(' ').map((n:string)=>n[0]).join('').slice(0,2).toUpperCase()

  const handleSave = async () => {
    if (name.trim().length < 2) { setError('Name too short'); return }
    setError(''); setLoading(true)
    try {
      const res = await fetch('/api/user', { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ name: name.trim() }) })
      if (!res.ok) { const d = await res.json(); setError(d.error||'Failed'); return }
      setEditing(false); setSaved(true); setTimeout(()=>setSaved(false), 2000); router.refresh()
    } catch { setError('Network error') }
    finally { setLoading(false) }
  }

  return (
    <div className="glass hover-lift" style={{borderRadius:'var(--r-lg)',padding:'28px',position:'relative',overflow:'hidden'}}>
      {/* Decorative corner */}
      <div style={{position:'absolute',top:'-20px',right:'-20px',width:'80px',height:'80px',background:'radial-gradient(circle,rgba(184,245,60,0.08),transparent 70%)',pointerEvents:'none'}} />

      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'24px'}}>
        <span className="section-label">Identity</span>
        <button onClick={()=>{setEditing(!editing);setError('')}} style={{padding:'5px 12px',background:editing?'var(--coral-bg)':'var(--surface)',border:`1px solid ${editing?'rgba(255,107,74,0.2)':'var(--rim)'}`,borderRadius:'100px',color:editing?'var(--coral)':'var(--text-3)',fontSize:'11px',fontWeight:600,cursor:'pointer',transition:'all 0.15s',letterSpacing:'0.04em',textTransform:'uppercase'}}>
          {editing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {/* Avatar */}
      <div style={{display:'flex',flexDirection:'column',alignItems:'center',marginBottom:'24px'}}>
        <div style={{position:'relative',marginBottom:'16px'}}>
          <div style={{width:'72px',height:'72px',borderRadius:'20px',background:'linear-gradient(135deg,var(--lime-bg) 0%,var(--surface) 100%)',border:'1px solid rgba(184,245,60,0.2)',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <span className="display" style={{fontSize:'26px',color:'var(--lime)'}}>{initials}</span>
          </div>
          {saved && <div style={{position:'absolute',top:'-4px',right:'-4px',width:'18px',height:'18px',background:'var(--lime)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'9px'}}>✓</div>}
        </div>

        {editing ? (
          <div style={{width:'100%'}}>
            <input className="field" value={name} onChange={e=>setName(e.target.value)} style={{textAlign:'center',marginBottom:'8px'}} placeholder="Your name" />
            {error && <p style={{color:'var(--coral)',fontSize:'12px',textAlign:'center',marginBottom:'8px'}}>{error}</p>}
            <button onClick={handleSave} disabled={loading} className="btn-lime" style={{width:'100%',padding:'10px'}}>
              {loading ? 'Saving…' : 'Save →'}
            </button>
          </div>
        ) : (
          <>
            <div className="display" style={{fontSize:'22px',color:'var(--text-1)',marginBottom:'4px'}}>{user?.name}</div>
            <div className="mono" style={{color:'var(--text-3)',fontSize:'12px'}}>{user?.email}</div>
          </>
        )}
      </div>

      {/* Info rows */}
      <div style={{borderTop:'1px solid var(--rim)',paddingTop:'20px',display:'flex',flexDirection:'column',gap:'12px'}}>
        {[
          {k:'Joined', v: new Date(user?.createdAt).toLocaleDateString('en-US',{day:'numeric',month:'short',year:'numeric'})},
          {k:'Wallet', v: user?.walletVerified ? '✓ Verified' : user?.walletAddress ? '~ Linked' : '— None', accent: user?.walletVerified ? 'var(--lime)' : user?.walletAddress ? '#f5a623' : 'var(--text-3)'},
        ].map(row => (
          <div key={row.k} style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <span style={{fontSize:'12px',color:'var(--text-3)'}}>{row.k}</span>
            <span style={{fontSize:'12px',color:row.accent||'var(--text-2)',fontWeight:600}}>{row.v}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
