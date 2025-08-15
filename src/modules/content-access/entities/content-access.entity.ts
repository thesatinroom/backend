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
import { Content } from '../../content/entities/content.entity';
import { SubscriptionTier } from '../../subscription-tiers/entities/subscription-tier.entity';

export enum AccessType {
  SUBSCRIPTION = 'subscription',
  ONE_TIME_PURCHASE = 'one_time_purchase',
  FREE = 'free',
  INVITE = 'invite',
  ADMIN = 'admin',
}

export enum AccessStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  REVOKED = 'revoked',
  PENDING = 'pending',
}

@Entity('content_access')
export class ContentAccess {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: AccessType,
    default: AccessType.SUBSCRIPTION,
  })
  accessType: AccessType;

  @Column({
    type: 'enum',
    enum: AccessStatus,
    default: AccessStatus.ACTIVE,
  })
  status: AccessStatus;

  @Column()
  grantedAt: Date;

  @Column({ nullable: true })
  expiresAt: Date;

  @Column({ nullable: true })
  revokedAt: Date;

  @Column({ type: 'text', nullable: true })
  revokeReason: string;

  @Column({ type: 'jsonb', nullable: true })
  permissions: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @Column({ default: false })
  isUnlimited: boolean;

  @Column({ default: 1 })
  accessCount: number;

  @Column({ nullable: true })
  lastAccessedAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  accessLog: Record<string, any>[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Content, (content) => content.accessRecords)
  @JoinColumn()
  content: Content;

  @ManyToOne(() => SubscriptionTier, { nullable: true })
  @JoinColumn()
  subscriptionTier: SubscriptionTier;

  // Virtual properties
  get isActive(): boolean {
    return this.status === AccessStatus.ACTIVE;
  }

  get isExpired(): boolean {
    if (this.isUnlimited) return false;
    return this.expiresAt ? new Date() > this.expiresAt : false;
  }

  get isRevoked(): boolean {
    return this.status === AccessStatus.REVOKED;
  }

  get daysUntilExpiry(): number {
    if (this.isUnlimited || !this.expiresAt) return -1;
    const now = new Date();
    const timeDiff = this.expiresAt.getTime() - now.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  get canAccess(): boolean {
    return this.isActive && !this.isExpired && !this.isRevoked;
  }
}
