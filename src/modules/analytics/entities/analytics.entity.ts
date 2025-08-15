import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { CreatorProfile } from '../../creator-profiles/entities/creator-profile.entity';
import { Content } from '../../content/entities/content.entity';

export enum AnalyticsType {
  USER_ACTIVITY = 'user_activity',
  CONTENT_PERFORMANCE = 'content_performance',
  SUBSCRIPTION_METRICS = 'subscription_metrics',
  PAYMENT_ANALYTICS = 'payment_analytics',
  ENGAGEMENT_METRICS = 'engagement_metrics',
  REVENUE_ANALYTICS = 'revenue_analytics',
  PLATFORM_METRICS = 'platform_metrics',
}

export enum MetricCategory {
  VIEWS = 'views',
  ENGAGEMENT = 'engagement',
  REVENUE = 'revenue',
  SUBSCRIPTIONS = 'subscriptions',
  RETENTION = 'retention',
  GROWTH = 'growth',
  PERFORMANCE = 'performance',
}

@Entity('analytics')
export class Analytics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: AnalyticsType,
    default: AnalyticsType.USER_ACTIVITY,
  })
  type: AnalyticsType;

  @Column({
    type: 'enum',
    enum: MetricCategory,
    default: MetricCategory.PERFORMANCE,
  })
  category: MetricCategory;

  @Column()
  metricName: string;

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  numericValue: number;

  @Column({ type: 'text', nullable: true })
  stringValue: string;

  @Column({ type: 'jsonb', nullable: true })
  jsonValue: Record<string, any>;

  @Column()
  timestamp: Date;

  @Column({ nullable: true })
  period: string; // daily, weekly, monthly, yearly

  @Column({ nullable: true })
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @Column({ type: 'jsonb', nullable: true })
  dimensions: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  filters: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @Column({ default: false })
  isProcessed: boolean;

  @Column({ nullable: true })
  processedAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  processedData: Record<string, any>;

  @Column({ default: 0 })
  confidence: number; // 0-100 confidence level

  @Column({ type: 'text', nullable: true })
  source: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn()
  user: User;

  @ManyToOne(() => CreatorProfile, { nullable: true })
  @JoinColumn()
  creatorProfile: CreatorProfile;

  @ManyToOne(() => Content, { nullable: true })
  @JoinColumn()
  content: Content;

  // Virtual properties
  get value(): any {
    if (this.numericValue !== null) return this.numericValue;
    if (this.stringValue !== null) return this.stringValue;
    if (this.jsonValue !== null) return this.jsonValue;
    return null;
  }

  get isNumeric(): boolean {
    return this.numericValue !== null;
  }

  get isString(): boolean {
    return this.stringValue !== null;
  }

  get isJson(): boolean {
    return this.jsonValue !== null;
  }

  get isTimeSeries(): boolean {
    return !!(this.startDate && this.endDate);
  }

  get timeRange(): number {
    if (!this.startDate || !this.endDate) return 0;
    return this.endDate.getTime() - this.startDate.getTime();
  }

  get isRecent(): boolean {
    const now = new Date();
    const timeDiff = now.getTime() - this.timestamp.getTime();
    const oneDay = 24 * 60 * 60 * 1000;
    return timeDiff < oneDay;
  }
}
