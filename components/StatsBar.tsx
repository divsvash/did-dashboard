'use client'
interface StatsBarProps {
  activityCount: number
  walletConnected: boolean
  memberSince: string
}

export default function StatsBar({ activityCount, walletConnected, memberSince }: StatsBarProps) {
  return (
    <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'12px'}}>
      {/* Activity count */}
      <div className="glass hover-lift" style={{borderRadius:'var(--r-lg)',padding:'20px 24px',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:0,left:0,right:0,height:'2px',background:'linear-gradient(90deg,var(--lime),transparent)'}} />
        <div className="section-label" style={{marginBottom:'12px'}}>Activity</div>
        <div className="display" style={{fontSize:'40px',color:'var(--lime)',lineHeight:1,marginBottom:'4px'}}>{activityCount}</div>
        <div style={{fontSize:'12px',color:'var(--text-3)'}}>events logged</div>
      </div>

      {/* Wallet status */}
      <div className="glass hover-lift" style={{borderRadius:'var(--r-lg)',padding:'20px 24px',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:0,left:0,right:0,height:'2px',background:`linear-gradient(90deg,${walletConnected?'var(--lime)':'var(--coral)'},transparent)`}} />
        <div className="section-label" style={{marginBottom:'12px'}}>Web3 Wallet</div>
        <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'4px'}}>
          <span className="dot-live" style={{width:'8px',height:'8px',borderRadius:'50%',background:walletConnected?'var(--lime)':'var(--coral)',display:'inline-block',flexShrink:0}} />
          <span className="display" style={{fontSize:'20px',color:walletConnected?'var(--lime)':'var(--coral)'}}>{walletConnected?'Connected':'Not Linked'}</span>
        </div>
        <div style={{fontSize:'12px',color:'var(--text-3)'}}>{walletConnected?'Identity on-chain':'Connect MetaMask'}</div>
      </div>

      {/* Member since */}
      <div className="glass hover-lift" style={{borderRadius:'var(--r-lg)',padding:'20px 24px',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:0,left:0,right:0,height:'2px',background:'linear-gradient(90deg,var(--sky),transparent)'}} />
        <div className="section-label" style={{marginBottom:'12px'}}>Member Since</div>
        <div className="display" style={{fontSize:'28px',color:'var(--sky)',lineHeight:1,marginBottom:'4px'}}>{memberSince}</div>
        <div style={{fontSize:'12px',color:'var(--text-3)'}}>identity created</div>
      </div>
    </div>
  )
}
