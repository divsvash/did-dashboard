'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Suspense } from 'react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const registered = searchParams.get('registered')
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const result = await signIn('credentials', { email: form.email, password: form.password, redirect: false })
      if (result?.error) { setError('Invalid email or password'); return }
      router.push('/dashboard')
      router.refresh()
    } catch { setError('Network error. Try again.') }
    finally { setLoading(false) }
  }

  return (
    <div style={{width:'100%',maxWidth:'420px'}}>
      <Link href="/" style={{display:'inline-flex',alignItems:'center',gap:'6px',color:'var(--text-3)',textDecoration:'none',fontSize:'13px',marginBottom:'40px',transition:'color 0.15s'}}
        onMouseEnter={e=>(e.currentTarget.style.color='var(--text-1)')} onMouseLeave={e=>(e.currentTarget.style.color='var(--text-3)')}>
        ← Back
      </Link>

      <div className="glass-strong lime-glow slide-up" style={{borderRadius:'var(--r-xl)',padding:'40px',animationDelay:'0.05s'}}>
        {/* Header */}
        <div style={{marginBottom:'32px'}}>
          <div style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:'48px',height:'48px',background:'var(--lime-bg)',border:'1px solid rgba(184,245,60,0.25)',borderRadius:'var(--r-md)',marginBottom:'20px'}}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="3" y="9" width="14" height="9" rx="2" stroke="var(--lime)" strokeWidth="1.5"/>
              <path d="M7 9V6a3 3 0 016 0v3" stroke="var(--lime)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 className="display" style={{fontSize:'28px',color:'var(--text-1)',marginBottom:'6px'}}>Welcome back</h1>
          <p style={{color:'var(--text-2)',fontSize:'14px'}}>Access your identity dashboard</p>
        </div>

        {registered && (
          <div style={{padding:'12px 16px',background:'var(--lime-bg)',border:'1px solid rgba(184,245,60,0.2)',borderRadius:'var(--r-sm)',marginBottom:'24px',fontSize:'13px',color:'var(--lime)',display:'flex',alignItems:'center',gap:'8px'}}>
            <span>✓</span> Account created — sign in to continue
          </div>
        )}
        {error && (
          <div style={{padding:'12px 16px',background:'var(--coral-bg)',border:'1px solid rgba(255,107,74,0.2)',borderRadius:'var(--r-sm)',marginBottom:'24px',fontSize:'13px',color:'var(--coral)',display:'flex',alignItems:'center',gap:'8px'}}>
            <span>✗</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'16px'}}>
          <div>
            <label className="section-label" style={{display:'block',marginBottom:'8px'}}>Email</label>
            <input type="email" className="field" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} placeholder="you@example.com" required />
          </div>
          <div>
            <label className="section-label" style={{display:'block',marginBottom:'8px'}}>Password</label>
            <input type="password" className="field" value={form.password} onChange={e=>setForm(p=>({...p,password:e.target.value}))} placeholder="••••••••" required />
          </div>
          <button type="submit" className="btn-lime" disabled={loading} style={{width:'100%',marginTop:'8px',padding:'14px'}}>
            {loading ? <><span className="spin" style={{width:'14px',height:'14px',border:'2px solid var(--ink)',borderTopColor:'transparent',borderRadius:'50%',display:'inline-block'}} /> Signing in…</> : 'Sign In →'}
          </button>
        </form>

        <p style={{textAlign:'center',color:'var(--text-3)',fontSize:'13px',marginTop:'24px'}}>
          New here?{' '}
          <Link href="/signup" style={{color:'var(--lime)',textDecoration:'none',fontWeight:600}}>Create identity</Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <main style={{minHeight:'100vh',background:'var(--ink)',display:'flex',alignItems:'center',justifyContent:'center',padding:'40px 24px',position:'relative'}}>
      <div style={{position:'absolute',top:'20%',right:'10%',width:'300px',height:'300px',background:'radial-gradient(ellipse, rgba(184,245,60,0.05) 0%, transparent 65%)',pointerEvents:'none'}} />
      <Suspense fallback={<div style={{color:'var(--text-3)'}}>Loading…</div>}>
        <LoginForm />
      </Suspense>
    </main>
  )
}
