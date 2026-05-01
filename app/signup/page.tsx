'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Signup failed'); return }
      router.push('/login?registered=true')
    } catch { setError('Network error. Try again.') }
    finally { setLoading(false) }
  }

  const strength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3
  const strengthLabel = ['','Weak','Good','Strong'][strength]
  const strengthColor = ['','var(--coral)','#f5a623','var(--lime)'][strength]

  return (
    <main style={{minHeight:'100vh',background:'var(--ink)',display:'flex',alignItems:'center',justifyContent:'center',padding:'40px 24px',position:'relative'}}>
      <div style={{position:'absolute',bottom:'10%',left:'5%',width:'400px',height:'400px',background:'radial-gradient(ellipse,rgba(255,107,74,0.04) 0%,transparent 65%)',pointerEvents:'none'}} />

      <div style={{width:'100%',maxWidth:'420px'}}>
        <Link href="/" style={{display:'inline-flex',alignItems:'center',gap:'6px',color:'var(--text-3)',textDecoration:'none',fontSize:'13px',marginBottom:'40px',transition:'color 0.15s'}}
          onMouseEnter={e=>(e.currentTarget.style.color='var(--text-1)')} onMouseLeave={e=>(e.currentTarget.style.color='var(--text-3)')}>
          ← Back
        </Link>

        <div className="glass-strong coral-glow slide-up" style={{borderRadius:'var(--r-xl)',padding:'40px',animationDelay:'0.05s'}}>
          <div style={{marginBottom:'32px'}}>
            <div style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:'48px',height:'48px',background:'var(--coral-bg)',border:'1px solid rgba(255,107,74,0.25)',borderRadius:'var(--r-md)',marginBottom:'20px'}}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2a4 4 0 100 8 4 4 0 000-8zm-7 17a7 7 0 0114 0" stroke="var(--coral)" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <h1 className="display" style={{fontSize:'28px',color:'var(--text-1)',marginBottom:'6px'}}>Create identity</h1>
            <p style={{color:'var(--text-2)',fontSize:'14px'}}>Join the decentralized identity network</p>
          </div>

          {error && (
            <div style={{padding:'12px 16px',background:'var(--coral-bg)',border:'1px solid rgba(255,107,74,0.2)',borderRadius:'var(--r-sm)',marginBottom:'24px',fontSize:'13px',color:'var(--coral)'}}>
              ✗ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'16px'}}>
            <div>
              <label className="section-label" style={{display:'block',marginBottom:'8px'}}>Full Name</label>
              <input type="text" className="field" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="Satoshi Nakamoto" required minLength={2} />
            </div>
            <div>
              <label className="section-label" style={{display:'block',marginBottom:'8px'}}>Email</label>
              <input type="email" className="field" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} placeholder="satoshi@bitcoin.org" required />
            </div>
            <div>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px'}}>
                <label className="section-label">Password</label>
                {strength > 0 && <span style={{fontSize:'11px',fontWeight:600,color:strengthColor,textTransform:'uppercase',letterSpacing:'0.06em'}}>{strengthLabel}</span>}
              </div>
              <input type="password" className="field" value={form.password} onChange={e=>setForm(p=>({...p,password:e.target.value}))} placeholder="Min. 6 characters" required minLength={6} />
              {form.password.length > 0 && (
                <div style={{display:'flex',gap:'4px',marginTop:'8px'}}>
                  {[1,2,3].map(i => (
                    <div key={i} style={{flex:1,height:'3px',borderRadius:'2px',background:i<=strength ? strengthColor : 'var(--rim)',transition:'background 0.3s'}} />
                  ))}
                </div>
              )}
            </div>
            <button type="submit" className="btn-coral" disabled={loading} style={{width:'100%',marginTop:'8px',padding:'14px'}}>
              {loading ? <><span className="spin" style={{width:'14px',height:'14px',border:'2px solid #fff',borderTopColor:'transparent',borderRadius:'50%',display:'inline-block'}} /> Creating…</> : 'Create Account →'}
            </button>
          </form>

          <p style={{textAlign:'center',color:'var(--text-3)',fontSize:'13px',marginTop:'24px'}}>
            Already have an identity?{' '}
            <Link href="/login" style={{color:'var(--coral)',textDecoration:'none',fontWeight:600}}>Sign in</Link>
          </p>
        </div>
      </div>
    </main>
  )
}
