import mongoose, { Schema, Document, Model } from 'mongoose'

export type ActionType =
  | 'signup'
  | 'login'
  | 'logout'
  | 'profile_update'
  | 'wallet_connect'
  | 'wallet_disconnect'
  | 'wallet_verify'

export interface IActivity extends Document {
  userId: mongoose.Types.ObjectId
  action: ActionType
  metadata?: Record<string, any>
  timestamp: Date
}

const ActivitySchema: Schema<IActivity> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    action: {
      type: String,
      required: true,
      enum: ['signup', 'login', 'logout', 'profile_update', 'wallet_connect', 'wallet_disconnect', 'wallet_verify'],
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: false }
)

const Activity: Model<IActivity> =
  mongoose.models.Activity || mongoose.model<IActivity>('Activity', ActivitySchema)

export default Activity
