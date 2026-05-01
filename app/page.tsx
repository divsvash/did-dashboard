import Link from 'next/link'

export default function LandingPage() {
  return (
    <main style={{minHeight:'100vh',background:'var(--ink)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'40px 24px',position:'relative',overflow:'hidden'}}>
      {/* Organic blob backgrounds */}
      <div style={{position:'absolute',top:'-10%',right:'-5%',width:'500px',height:'500px',background:'radial-gradient(ellipse, rgba(184,245,60,0.06) 0%, transparent 65%)',pointerEvents:'none'}} />
      <div style={{position:'absolute',bottom:'0',left:'-10%',width:'400px',height:'400px',background:'radial-gradient(ellipse, rgba(255,107,74,0.05) 0%, transparent 65%)',pointerEvents:'none'}} />

      {/* Live indicator */}
      <div className="fade-in" style={{animationDelay:'0s',marginBottom:'48px',display:'flex',alignItems:'center',gap:'8px',padding:'6px 14px',background:'var(--lime-bg)',border:'1px solid rgba(184,245,60,0.2)',borderRadius:'100px'}}>
        <span className="dot-live" style={{width:'6px',height:'6px',borderRadius:'50%',background:'var(--lime)',display:'inline-block'}} />
        <span className="mono" style={{color:'var(--lime)',fontSize:'11px'}}>Identity Protocol v2.4 — LIVE</span>
      </div>

      {/* Hero headline */}
      <div className="slide-up" style={{animationDelay:'0.05s',textAlign:'center',maxWidth:'640px',marginBottom:'40px'}}>
        <h1 className="display" style={{fontSize:'clamp(52px,8vw,96px)',color:'var(--text-1)',marginBottom:'24px'}}>
          Your identity.<br />
          <span style={{color:'var(--lime)'}}>On-chain.</span>
        </h1>
        <p style={{fontSize:'17px',color:'var(--text-2)',lineHeight:'1.7',fontStyle:'italic',maxWidth:'480px',margin:'0 auto'}}>
          Manage credentials, verify ownership, and build your decentralized reputation — all in one living dashboard.
        </p>
      </div>

      {/* CTA group */}
      <div className="slide-up" style={{animationDelay:'0.15s',display:'flex',gap:'12px',flexWrap:'wrap',justifyContent:'center',marginBottom:'80px'}}>
        <Link href="/signup"><button className="btn-lime" style={{padding:'14px 32px',fontSize:'15px'}}>Create Identity →</button></Link>
        <Link href="/login"><button className="btn-ghost" style={{padding:'14px 28px',fontSize:'15px'}}>Sign In</button></Link>
      </div>

      {/* Feature grid */}
      <div className="slide-up" style={{animationDelay:'0.25s',display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'12px',width:'100%',maxWidth:'720px'}}>
        {[
          {icon:'⚡',label:'NextAuth Sessions',desc:'JWT-secured, server-side'},
          {icon:'🗄️',label:'MongoDB Atlas',desc:'Real data, no fakes'},
          {icon:'🦊',label:'MetaMask Wallet',desc:'Sign & verify on-chain'},
          {icon:'📊',label:'Activity Timeline',desc:'Every action logged'},
        ].map((f,i) => (
          <div key={f.label} className="glass hover-lift" style={{padding:'20px',borderRadius:'var(--r-md)',animationDelay:`${0.3+i*0.05}s`}}>
            <div style={{fontSize:'24px',marginBottom:'8px'}}>{f.icon}</div>
            <div style={{fontWeight:600,color:'var(--text-1)',fontSize:'13px',marginBottom:'4px'}}>{f.label}</div>
            <div style={{fontSize:'12px',color:'var(--text-3)'}}>{f.desc}</div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <p className="mono fade-in" style={{animationDelay:'0.5s',position:'absolute',bottom:'24px',color:'var(--text-3)',fontSize:'11px'}}>
        Next.js 14 · TypeScript · Tailwind · Vercel
      </p>
    </main>
  )
}
