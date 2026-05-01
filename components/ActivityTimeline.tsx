'use client'
import { useState } from 'react'

interface Activity { _id: string; action: string; timestamp: string; metadata?: any }

const CFG: Record<string,{label:string;accent:string;bg:string;symbol:string}> = {
  signup:           {label:'Account Created',    accent:'var(--lime)',   bg:'var(--lime-bg)',   symbol:'◈'},
  login:            {label:'Signed In',          accent:'var(--sky)',    bg:'var(--sky-bg)',    symbol:'→'},
  logout:           {label:'Signed Out',         accent:'var(--text-3)', bg:'var(--surface)',   symbol:'←'},
  profile_update:   {label:'Profile Updated',    accent:'#f5a623',       bg:'#1e1608',          symbol:'✎'},
  wallet_connect:   {label:'Wallet Connected',   accent:'var(--lime)',   bg:'var(--lime-bg)',   symbol:'⬡'},
  wallet_disconnect:{label:'Wallet Removed',     accent:'var(--coral)',  bg:'var(--coral-bg)',  symbol:'⬡'},
  wallet_verify:    {label:'Wallet Verified',    accent:'var(--lime)',   bg:'var(--lime-bg)',   symbol:'✓'},
}

function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime()
  const m = Math.floor(diff/60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m/60)
  if (h < 24) return `${h}h ago`
  const days = Math.floor(h/24)
  if (days < 7) return `${days}d ago`
  return new Date(d).toLocaleDateString('en-US',{month:'short',day:'numeric'})
}

export default function ActivityTimeline({ activities }: { activities: Activity[] }) {
  const [filter, setFilter] = useState('all')
  const filters = ['all','login','wallet_connect','profile_update']
  const filtered = filter === 'all' ? activities : activities.filter(a=>a.action===filter)

  return (
    <div className="glass" style={{borderRadius:'var(--r-lg)',padding:'28px',height:'100%'}}>
      {/* Header */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'24px',flexWrap:'wrap',gap:'12px'}}>
        <div>
          <div className="section-label" style={{marginBottom:'4px'}}>Activity Timeline</div>
          <div className="display" style={{fontSize:'20px',color:'var(--text-1)'}}>{filtered.length} <span style={{color:'var(--text-3)',fontWeight:400,fontSize:'14px'}}>events</span></div>
        </div>
        {/* Filters */}
        <div style={{display:'flex',gap:'6px',flexWrap:'wrap'}}>
          {filters.map(f => (
            <button key={f} onClick={()=>setFilter(f)} style={{padding:'5px 12px',borderRadius:'100px',fontSize:'11px',fontWeight:600,letterSpacing:'0.04em',textTransform:'uppercase',cursor:'pointer',transition:'all 0.15s',background:filter===f?'var(--lime-bg)':'transparent',color:filter===f?'var(--lime)':'var(--text-3)',border:`1px solid ${filter===f?'rgba(184,245,60,0.2)':'var(--rim)'}`}}>
              {f==='all'?'All':f.replace('_',' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      {filtered.length === 0 ? (
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'60px 0',color:'var(--text-3)',textAlign:'center'}}>
          <div style={{fontSize:'32px',marginBottom:'12px',opacity:0.5}}>◌</div>
          <div style={{fontWeight:600,fontSize:'14px',marginBottom:'4px'}}>No events yet</div>
          <div style={{fontSize:'12px'}}>Actions will appear here in real-time</div>
        </div>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:'2px',maxHeight:'480px',overflowY:'auto',paddingRight:'4px'}}>
          {filtered.map((a, i) => {
            const c = CFG[a.action] || {label:a.action,accent:'var(--text-2)',bg:'var(--surface)',symbol:'·'}
            const isFirst = i === 0
            return (
              <div key={a._id} style={{display:'flex',alignItems:'center',gap:'14px',padding:'12px',borderRadius:'var(--r-sm)',transition:'background 0.15s',cursor:'default',background:isFirst?'var(--surface)':'transparent'}}
                onMouseEnter={e=>e.currentTarget.style.background='var(--surface)'}
                onMouseLeave={e=>e.currentTarget.style.background=isFirst?'var(--surface)':'transparent'}>
                {/* Icon */}
                <div style={{width:'32px',height:'32px',borderRadius:'8px',background:c.bg,border:`1px solid ${c.accent}22`,display:'flex',alignItems:'center',justifyContent:'center',color:c.accent,fontSize:'13px',fontWeight:700,flexShrink:0}}>
                  {c.symbol}
                </div>
                {/* Content */}
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:600,fontSize:'13px',color:isFirst?c.accent:'var(--text-1)'}}>{c.label}</div>
                  {a.metadata && Object.keys(a.metadata).length > 0 && (
                    <div className="mono" style={{fontSize:'10px',color:'var(--text-3)',marginTop:'2px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                      {JSON.stringify(a.metadata).slice(0,50)}
                    </div>
                  )}
                </div>
                {/* Time */}
                <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:'2px',flexShrink:0}}>
                  {isFirst && <span className="tag tag-lime" style={{fontSize:'9px',padding:'2px 7px'}}>Latest</span>}
                  <span className="mono" style={{fontSize:'11px',color:'var(--text-3)'}}>{timeAgo(a.timestamp)}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
