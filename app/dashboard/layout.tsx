import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/Sidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  return (
    <div style={{minHeight:'100vh',display:'flex',background:'var(--ink)'}}>
      <Sidebar user={session.user} />
      <main style={{flex:1,overflowAuto:'auto',padding:'40px 32px',minHeight:'100vh'}}>
        {children}
      </main>
    </div>
  )
}
