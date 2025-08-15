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
import { CreatorProfile } from '../../creator-profiles/entities/creator-profile.entity';
import { Subscription } from '../../subscriptions/entities/subscription.entity';

export enum BillingCycle {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
}

export enum TierStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived',
}

@Entity('subscription_tiers')
export class SubscriptionTier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({
    type: 'enum',
    enum: BillingCycle,
    default: BillingCycle.MONTHLY,
  })
  billingCycle: BillingCycle;

  @Column({ type: 'jsonb', nullable: true })
  features: string[];

  @Column({ type: 'jsonb', nullable: true })
  benefits: string[];

  @Column({ default: 0 })
  maxSubscribers: number;

  @Column({ default: 0 })
  currentSubscribers: number;

  @Column({
    type: 'enum',
    enum: TierStatus,
    default: TierStatus.ACTIVE,
  })
  status: TierStatus;

  @Column({ default: false })
  isPopular: boolean;

  @Column({ default: false })
  isCustom: boolean;

  @Column({ type: 'jsonb', nullable: true })
  customFields: Record<string, any>;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  discountPercentage: number;

  @Column({ nullable: true })
  discountValidUntil: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => CreatorProfile, (profile) => profile.subscriptionTiers)
  @JoinColumn()
  creatorProfile: CreatorProfile;

  @OneToMany(() => Subscription, (subscription) => subscription.tier)
  subscriptions: Subscription[];

  // Virtual properties
  get isAvailable(): boolean {
    return this.status === TierStatus.ACTIVE && 
           (this.maxSubscribers === 0 || this.currentSubscribers < this.maxSubscribers);
  }

  get discountedPrice(): number {
    if (this.discountPercentage && this.discountValidUntil && new Date() < this.discountValidUntil) {
      return this.price * (1 - this.discountPercentage / 100);
    }
    return this.price;
  }

  get hasDiscount(): boolean {
    return !!(this.discountPercentage && this.discountValidUntil && new Date() < this.discountValidUntil);
  }
}
