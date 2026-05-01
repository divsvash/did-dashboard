'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { useState } from 'react'

interface SidebarProps {
  user: { name?: string | null; email?: string | null } | undefined
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const [signingOut, setSigningOut] = useState(false)

  const handleSignOut = async () => {
    setSigningOut(true)
    try { await fetch('/api/activity', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({action:'logout'}) }) } catch {}
    await signOut({ callbackUrl: '/' })
  }

  const initials = user?.name ? user.name.split(' ').map((n:string)=>n[0]).join('').slice(0,2).toUpperCase() : '?'

  return (
    <aside style={{width:'220px',minHeight:'100vh',background:'var(--ink-2)',borderRight:'1px solid var(--rim)',display:'flex',flexDirection:'column',flexShrink:0}}>
      {/* Logo */}
      <div style={{padding:'28px 20px 20px',borderBottom:'1px solid var(--rim)'}}>
        <Link href="/" style={{textDecoration:'none',display:'flex',alignItems:'center',gap:'10px'}}>
          <div style={{width:'32px',height:'32px',background:'var(--lime)',borderRadius:'8px',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
            <span className="display" style={{fontSize:'11px',color:'var(--ink)',fontWeight:800}}>DID</span>
          </div>
          <div>
            <div className="display" style={{fontSize:'14px',color:'var(--text-1)',lineHeight:1}}>Identity</div>
            <div className="mono" style={{fontSize:'10px',color:'var(--text-3)',lineHeight:1.4}}>Dashboard</div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav style={{flex:1,padding:'16px 12px',display:'flex',flexDirection:'column',gap:'4px'}}>
        {[
          {href:'/dashboard',label:'Overview',icon:(
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <rect x="1" y="1" width="5.5" height="5.5" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
              <rect x="8.5" y="1" width="5.5" height="5.5" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
              <rect x="1" y="8.5" width="5.5" height="5.5" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
              <rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
            </svg>
          )},
        ].map(item => {
          const active = pathname === item.href
          return (
            <Link key={item.href} href={item.href} style={{textDecoration:'none',display:'flex',alignItems:'center',gap:'10px',padding:'9px 12px',borderRadius:'var(--r-sm)',background:active?'var(--lime-bg)':'transparent',color:active?'var(--lime)':'var(--text-2)',fontSize:'13px',fontWeight:active?600:400,border:active?'1px solid rgba(184,245,60,0.15)':'1px solid transparent',transition:'all 0.15s'}}>
              {item.icon}
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div style={{padding:'12px',borderTop:'1px solid var(--rim)',display:'flex',flexDirection:'column',gap:'8px'}}>
        <div style={{display:'flex',alignItems:'center',gap:'10px',padding:'10px 12px',background:'var(--surface)',borderRadius:'var(--r-sm)',border:'1px solid var(--rim)'}}>
          <div style={{width:'30px',height:'30px',borderRadius:'8px',background:'linear-gradient(135deg, var(--lime-bg), var(--surface))',border:'1px solid rgba(184,245,60,0.2)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
            <span className="display" style={{fontSize:'10px',color:'var(--lime)',fontWeight:800}}>{initials}</span>
          </div>
          <div style={{minWidth:0}}>
            <div style={{fontSize:'12px',fontWeight:600,color:'var(--text-1)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{user?.name}</div>
            <div className="mono" style={{fontSize:'10px',color:'var(--text-3)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{user?.email}</div>
          </div>
        </div>
        <button onClick={handleSignOut} disabled={signingOut} style={{width:'100%',display:'flex',alignItems:'center',gap:'8px',padding:'9px 12px',background:'transparent',border:'1px solid transparent',borderRadius:'var(--r-sm)',color:'var(--text-3)',fontSize:'13px',cursor:'pointer',transition:'all 0.15s'}}
          onMouseEnter={e=>{e.currentTarget.style.background='var(--coral-bg)';e.currentTarget.style.color='var(--coral)';e.currentTarget.style.borderColor='rgba(255,107,74,0.15)'}}
          onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color='var(--text-3)';e.currentTarget.style.borderColor='transparent'}}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2h2a1 1 0 011 1v8a1 1 0 01-1 1H9M6 10l3-3-3-3M9 7H2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {signingOut ? 'Signing out…' : 'Sign Out'}
        </button>
      </div>
    </aside>
  )
}
