'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

declare global { interface Window { ethereum?: any } }

export default function WalletSection({ user }: { user: any }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [phase, setPhase] = useState<'idle'|'requesting'|'signing'|'saving'>('idle')
  const [justConnected, setJustConnected] = useState(false)

  const short = (addr: string) => addr ? `${addr.slice(0,6)}…${addr.slice(-4)}` : ''
  const hasWallet = !!user?.walletAddress

  const connect = async () => {
    setError(''); setLoading(true); setPhase('requesting')
    if (typeof window.ethereum === 'undefined') {
      setError('MetaMask not detected — install it first'); setLoading(false); setPhase('idle'); return
    }
    try {
      const accounts: string[] = await window.ethereum.request({ method: 'eth_requestAccounts' })
      if (!accounts.length) { setError('No accounts found'); return }
      const address = accounts[0].toLowerCase()
      setPhase('signing')
      let signature = ''
      const message = `DID Dashboard: Verify wallet\nAddress: ${address}\nNonce: ${Date.now()}`
      try { signature = await window.ethereum.request({ method: 'personal_sign', params: [message, address] }) }
      catch (signErr: any) { if (signErr.code !== 4001) throw signErr }
      setPhase('saving')
      const res = await fetch('/api/user', { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ walletAddress: address, walletVerified: !!signature }) })
      if (!res.ok) { const d = await res.json(); setError(d.error||'Failed'); return }
      setJustConnected(true); setTimeout(()=>setJustConnected(false), 3000)
      router.refresh()
    } catch (err: any) {
      setError(err.code === 4001 ? 'User rejected the request' : err.message||'Failed to connect')
    } finally { setLoading(false); setPhase('idle') }
  }

  const disconnect = async () => {
    setLoading(true)
    try {
      await fetch('/api/user', { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ walletAddress:'', walletVerified:false }) })
      await fetch('/api/activity', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ action:'wallet_disconnect' }) })
      router.refresh()
    } catch { setError('Network error') }
    finally { setLoading(false) }
  }

  const phaseLabel: Record<string,string> = { requesting:'Requesting access…', signing:'Sign to verify…', saving:'Saving…', idle:'' }

  return (
    <div className={`glass ${hasWallet ? 'lime-glow' : ''} hover-lift`} style={{borderRadius:'var(--r-lg)',padding:'28px',position:'relative',overflow:'hidden'}}>
      {/* Top bar */}
      <div style={{position:'absolute',top:0,left:0,right:0,height:'2px',background:hasWallet?'linear-gradient(90deg,var(--lime),transparent)':'linear-gradient(90deg,var(--rim),transparent)'}} />

      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'20px'}}>
        <span className="section-label">Web3 Wallet</span>
        {hasWallet && <span className="tag tag-lime">
          <span className="dot-live" style={{width:'5px',height:'5px',borderRadius:'50%',background:'var(--lime)',display:'inline-block'}} />
          {user.walletVerified ? 'Verified' : 'Linked'}
        </span>}
      </div>

      {hasWallet ? (
        <div className={justConnected ? 'wallet-pop' : ''}>
          {/* Address display */}
          <div style={{background:'var(--lime-bg)',border:'1px solid rgba(184,245,60,0.15)',borderRadius:'var(--r-md)',padding:'16px 20px',marginBottom:'16px'}}>
            <div style={{fontSize:'11px',color:'var(--lime-dim)',fontWeight:600,letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:'8px'}}>
              Ethereum Address
            </div>
            <div className="mono" style={{color:'var(--lime)',fontSize:'14px',wordBreak:'break-all',lineHeight:1.5}}>
              {user.walletAddress}
            </div>
          </div>

          {user.walletVerified && (
            <div style={{display:'flex',alignItems:'center',gap:'8px',padding:'10px 14px',background:'var(--surface)',border:'1px solid var(--rim)',borderRadius:'var(--r-sm)',marginBottom:'16px',fontSize:'12px',color:'var(--text-2)'}}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7l3.5 3.5L12 3" stroke="var(--lime)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Ownership verified via signature
            </div>
          )}

          <button onClick={disconnect} disabled={loading} className="btn-ghost" style={{width:'100%',fontSize:'13px'}}>
            {loading ? 'Disconnecting…' : 'Disconnect Wallet'}
          </button>
        </div>
      ) : (
        <div>
          {/* Fox icon area */}
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',padding:'24px 0',marginBottom:'20px'}}>
            <div style={{position:'relative',width:'64px',height:'64px',marginBottom:'16px'}}>
              <div style={{width:'64px',height:'64px',borderRadius:'16px',background:'var(--surface)',border:'1px solid var(--rim)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'28px'}}>
                🦊
              </div>
              {loading && (
                <div style={{position:'absolute',inset:'-3px',borderRadius:'19px',border:'2px solid transparent',borderTopColor:'var(--lime)',animation:'spin 1s linear infinite'}} />
              )}
            </div>
            <div style={{fontWeight:600,color:'var(--text-1)',fontSize:'14px',marginBottom:'6px'}}>
              {loading ? phaseLabel[phase] : 'No wallet connected'}
            </div>
            <div style={{fontSize:'12px',color:'var(--text-3)',textAlign:'center'}}>
              {loading ? 'Check your MetaMask extension' : 'Link MetaMask to activate Web3 identity'}
            </div>
          </div>

          {error && <div style={{padding:'10px 14px',background:'var(--coral-bg)',border:'1px solid rgba(255,107,74,0.2)',borderRadius:'var(--r-sm)',marginBottom:'16px',fontSize:'12px',color:'var(--coral)'}}>{error}</div>}

          <button onClick={connect} disabled={loading} style={{width:'100%',padding:'14px',background:'var(--raised)',border:'1px solid var(--rim)',borderRadius:'var(--r-md)',color:'var(--text-1)',fontSize:'14px',fontWeight:600,cursor:'pointer',transition:'all 0.2s',display:'flex',alignItems:'center',justifyContent:'center',gap:'10px',fontFamily:'Cabinet Grotesk, sans-serif'}}
            onMouseEnter={e=>{if(!loading){e.currentTarget.style.borderColor='var(--lime)';e.currentTarget.style.color='var(--lime)';e.currentTarget.style.background='var(--lime-bg)'}}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--rim)';e.currentTarget.style.color='var(--text-1)';e.currentTarget.style.background='var(--raised)'}}>
            {loading ? (
              <span className="spin" style={{width:'16px',height:'16px',border:'2px solid var(--rim)',borderTopColor:'var(--lime)',borderRadius:'50%',display:'inline-block'}} />
            ) : '🦊'}
            {loading ? 'Connecting…' : 'Connect MetaMask'}
          </button>
        </div>
      )}
    </div>
  )
}
