import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { SubscriptionTier } from '../../subscription-tiers/entities/subscription-tier.entity';
import { Payment } from '../../payments/entities/payment.entity';

export enum SubscriptionStatus {
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
  PAUSED = 'paused',
  PENDING = 'pending',
  FAILED = 'failed',
}

export enum CancellationReason {
  TOO_EXPENSIVE = 'too_expensive',
  NOT_ENOUGH_CONTENT = 'not_enough_content',
  QUALITY_ISSUES = 'quality_issues',
  PERSONAL_REASONS = 'personal_reasons',
  FOUND_ALTERNATIVE = 'found_alternative',
  OTHER = 'other',
}

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.PENDING,
  })
  status: SubscriptionStatus;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column({ nullable: true })
  nextBillingDate: Date;

  @Column({ nullable: true })
  cancelledAt: Date;

  @Column({
    type: 'enum',
    enum: CancellationReason,
    nullable: true,
  })
  cancellationReason: CancellationReason;

  @Column({ type: 'text', nullable: true })
  cancellationNote: string;

  @Column({ default: false })
  autoRenew: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  discountAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  finalAmount: number;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @Column({ default: false })
  isGift: boolean;

  @Column({ nullable: true })
  giftMessage: string;

  @Column({ nullable: true })
  giftFrom: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.subscriptions)
  @JoinColumn()
  subscriber: User;

  @ManyToOne(() => SubscriptionTier, (tier) => tier.subscriptions)
  @JoinColumn()
  tier: SubscriptionTier;

  @OneToMany(() => Payment, (payment) => payment.subscription)
  payments: Payment[];

  // Virtual properties
  get isActive(): boolean {
    return this.status === SubscriptionStatus.ACTIVE;
  }

  get isExpired(): boolean {
    return new Date() > this.endDate;
  }

  get daysUntilExpiry(): number {
    const now = new Date();
    const timeDiff = this.endDate.getTime() - now.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  get totalPaid(): number {
    return this.payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
  }
}
