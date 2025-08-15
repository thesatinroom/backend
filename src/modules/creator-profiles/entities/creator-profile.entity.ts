import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { SubscriptionTier } from '../../subscription-tiers/entities/subscription-tier.entity';
import { Content } from '../../content/entities/content.entity';

export enum CreatorCategory {
  ARTIST = 'artist',
  MUSICIAN = 'musician',
  WRITER = 'writer',
  PHOTOGRAPHER = 'photographer',
  VIDEOGRAPHER = 'videographer',
  PODCASTER = 'podcaster',
  EDUCATOR = 'educator',
  FITNESS = 'fitness',
  COOKING = 'cooking',
  GAMING = 'gaming',
  OTHER = 'other',
}

export enum VerificationStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
}

@Entity('creator_profiles')
export class CreatorProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  socialMediaLinks: string; // JSON string of social media links

  @Column({
    type: 'enum',
    enum: CreatorCategory,
    default: CreatorCategory.OTHER,
  })
  category: CreatorCategory;

  @Column({ type: 'text', nullable: true })
  tags: string; // JSON string of tags

  @Column({ default: false })
  isVerified: boolean;

  @Column({
    type: 'enum',
    enum: VerificationStatus,
    default: VerificationStatus.PENDING,
  })
  verificationStatus: VerificationStatus;

  @Column({ nullable: true })
  verificationDocuments: string; // JSON string of document URLs

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalEarnings: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  monthlyEarnings: number;

  @Column({ default: 0 })
  totalSubscribers: number;

  @Column({ default: 0 })
  totalContent: number;

  @Column({ nullable: true })
  coverImage: string;

  @Column({ nullable: true })
  profileImage: string;

  @Column({ type: 'jsonb', nullable: true })
  customFields: Record<string, any>;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  deactivationReason: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToOne(() => User, (user) => user.creatorProfile)
  @JoinColumn()
  user: User;

  @OneToMany(() => SubscriptionTier, (tier) => tier.creatorProfile)
  subscriptionTiers: SubscriptionTier[];

  @OneToMany(() => Content, (content) => content.creatorProfile)
  content: Content[];

  // Virtual properties
  get displayName(): string {
    return this.user?.username || this.user?.fullName || 'Unknown Creator';
  }

  get isVerifiedCreator(): boolean {
    return this.isVerified && this.verificationStatus === VerificationStatus.VERIFIED;
  }
}
