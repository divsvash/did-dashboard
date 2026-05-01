import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import Activity from '@/models/Activity'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    const user = await User.findById((session.user as any).id).select('-password')
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('GET /api/user error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { name, walletAddress, walletVerified } = body

    const updates: Record<string, any> = {}

    if (name !== undefined) {
      if (name.trim().length < 2) {
        return NextResponse.json({ error: 'Name must be at least 2 characters' }, { status: 400 })
      }
      updates.name = name.trim()
    }

    if (walletAddress !== undefined) {
      if (walletAddress && !/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
        return NextResponse.json({ error: 'Invalid Ethereum wallet address' }, { status: 400 })
      }
      updates.walletAddress = walletAddress ? walletAddress.toLowerCase() : ''
    }

    if (walletVerified !== undefined) {
      updates.walletVerified = walletVerified
    }

    await dbConnect()

    const user = await User.findByIdAndUpdate(
      (session.user as any).id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password')

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Log activity
    const activityAction = walletAddress !== undefined ? 'wallet_connect' : 'profile_update'
    await Activity.create({
      userId: user._id,
      action: activityAction,
      metadata: { updatedFields: Object.keys(updates) },
    })

    return NextResponse.json({ user })
  } catch (error) {
    console.error('PATCH /api/user error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
