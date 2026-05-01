import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import Activity from '@/models/Activity'
import ProfileCard from '@/components/ProfileCard'
import WalletSection from '@/components/WalletSection'
import ActivityTimeline from '@/components/ActivityTimeline'
import StatsBar from '@/components/StatsBar'

async function getData(userId: string) {
  await dbConnect()
  const [user, activities] = await Promise.all([
    User.findById(userId).select('-password').lean(),
    Activity.find({ userId }).sort({ timestamp: -1 }).limit(25).lean(),
  ])
  return { user, activities }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  const { user, activities } = await getData((session!.user as any).id)

  const firstName = (user as any)?.name?.split(' ')[0] || 'there'
  const memberSince = new Date((user as any)?.createdAt).toLocaleDateString('en-US',{month:'short',year:'numeric'})

  return (
    <div style={{maxWidth:'1100px',margin:'0 auto',animation:'fadeIn 0.4s ease both'}}>
      {/* Top header */}
      <div style={{marginBottom:'32px',display:'flex',alignItems:'flex-end',justifyContent:'space-between',flexWrap:'wrap',gap:'16px'}}>
        <div>
          <div className="section-label" style={{marginBottom:'8px'}}>Dashboard</div>
          <h1 className="display" style={{fontSize:'clamp(28px,4vw,42px)',color:'var(--text-1)',lineHeight:1}}>
            Hey, <span style={{color:'var(--lime)'}}>{firstName}</span> 👋
          </h1>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:'8px',padding:'8px 16px',background:'var(--surface)',border:'1px solid var(--rim)',borderRadius:'100px'}}>
          <span className="dot-live" style={{width:'6px',height:'6px',borderRadius:'50%',background:'var(--lime)',display:'inline-block'}} />
          <span className="mono" style={{fontSize:'11px',color:'var(--text-3)'}}>Session active</span>
        </div>
      </div>

      {/* Stats row */}
      <div style={{marginBottom:'20px'}}>
        <StatsBar
          activityCount={activities.length}
          walletConnected={!!(user as any)?.walletAddress}
          memberSince={memberSince}
        />
      </div>

      {/* Main grid */}
      <div style={{display:'grid',gridTemplateColumns:'300px 1fr',gap:'20px',alignItems:'start'}}>
        {/* Left column */}
        <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
          <ProfileCard user={user} />
          <WalletSection user={user} />
        </div>
        {/* Right column */}
        <ActivityTimeline activities={activities as any} />
      </div>
    </div>
  )
}
