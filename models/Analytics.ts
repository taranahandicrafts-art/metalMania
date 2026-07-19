import mongoose, { Document, Model } from 'mongoose';
import { createBaseSchema } from './BaseSchema';
import type { Timestamps, AnalyticsEventType } from '@/types';

export interface IAnalytics extends Document, Timestamps {
  type: AnalyticsEventType;
  path: string;
  referrer: string | null;
  user_agent: string | null;
  ip: string | null;
  session_id: string | null;
  metadata: Record<string, unknown>;
  timestamp: Date;
}

interface IAnalyticsModel extends Model<IAnalytics> {
  build(data: Partial<IAnalytics>): IAnalytics;
}

const AnalyticsSchema = createBaseSchema<IAnalytics>({
  type: {
    type: String,
    enum: {
      values: ['pageview', 'event', 'conversion'],
      message: '{VALUE} is not a valid analytics event type',
    },
    required: [true, 'Event type is required'],
    index: true,
  },
  path: {
    type: String,
    required: [true, 'URL path is required'],
    trim: true,
    validate: {
      validator: function (path: string) {
        return path.startsWith('/');
      },
      message: 'Path must start with /',
    },
    index: true,
  },
  referrer: {
    type: String,
    default: null,
  },
  user_agent: {
    type: String,
    default: null,
    maxlength: [500, 'User agent string too long'],
  },
  ip: {
    type: String,
    default: null,
  },
  session_id: {
    type: String,
    default: null,
    index: true,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  timestamp: {
    type: Date,
    required: [true, 'Event timestamp is required'],
    default: Date.now,
  },
});

AnalyticsSchema.index({ type: 1, timestamp: -1 });
AnalyticsSchema.index({ path: 1, timestamp: -1 });
AnalyticsSchema.index(
  { timestamp: 1 },
  { expireAfterSeconds: 7776000 },
);

AnalyticsSchema.statics.build = function build(data: Partial<IAnalytics>): IAnalytics {
  return new this(data);
};

AnalyticsSchema.virtual('date_only').get(function dateOnly(): string {
  if (!this.timestamp) return '';
  return this.timestamp.toISOString().slice(0, 10);
});

AnalyticsSchema.virtual('hour_only').get(function hourOnly(): number {
  if (!this.timestamp) return 0;
  return this.timestamp.getHours();
});

const Analytics = (mongoose.models.Analytics as IAnalyticsModel) ||
  mongoose.model<IAnalytics, IAnalyticsModel>('Analytics', AnalyticsSchema);

export default Analytics;
