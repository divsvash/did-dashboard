import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import Activity from '@/models/Activity'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50)
    const page = Math.max(parseInt(searchParams.get('page') || '1'), 1)
    const skip = (page - 1) * limit

    await dbConnect()

    const userId = (session.user as any).id

    const [activities, total] = await Promise.all([
      Activity.find({ userId })
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Activity.countDocuments({ userId }),
    ])

    return NextResponse.json({
      activities,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error('GET /api/activity error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { action, metadata } = body

    const validActions = ['signup', 'login', 'logout', 'profile_update', 'wallet_connect', 'wallet_disconnect', 'wallet_verify']
    if (!action || !validActions.includes(action)) {
      return NextResponse.json({ error: 'Invalid action type' }, { status: 400 })
    }

    await dbConnect()

    const activity = await Activity.create({
      userId: (session.user as any).id,
      action,
      metadata: metadata || {},
    })

    return NextResponse.json({ activity }, { status: 201 })
  } catch (error) {
    console.error('POST /api/activity error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
