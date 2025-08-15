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
import { CreatorProfile } from '../../creator-profiles/entities/creator-profile.entity';
import { ContentAccess } from '../../content-access/entities/content-access.entity';

export enum ContentType {
  POST = 'post',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  LIVE_STREAM = 'live_stream',
  STORY = 'story',
  POLL = 'poll',
  QUIZ = 'quiz',
  OTHER = 'other',
}

export enum ContentStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  SCHEDULED = 'scheduled',
  ARCHIVED = 'archived',
  DELETED = 'deleted',
}

export enum ContentVisibility {
  PUBLIC = 'public',
  SUBSCRIBERS_ONLY = 'subscribers_only',
  TIER_SPECIFIC = 'tier_specific',
  PRIVATE = 'private',
}

@Entity('content')
export class Content {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({
    type: 'enum',
    enum: ContentType,
    default: ContentType.POST,
  })
  type: ContentType;

  @Column({
    type: 'enum',
    enum: ContentStatus,
    default: ContentStatus.DRAFT,
  })
  status: ContentStatus;

  @Column({
    type: 'enum',
    enum: ContentVisibility,
    default: ContentVisibility.SUBSCRIBERS_ONLY,
  })
  visibility: ContentVisibility;

  @Column({ type: 'jsonb', nullable: true })
  mediaUrls: string[];

  @Column({ type: 'jsonb', nullable: true })
  tags: string[];

  @Column({ type: 'jsonb', nullable: true })
  categories: string[];

  @Column({ nullable: true })
  thumbnailUrl: string;

  @Column({ nullable: true })
  scheduledAt: Date;

  @Column({ nullable: true })
  publishedAt: Date;

  @Column({ nullable: true })
  archivedAt: Date;

  @Column({ default: 0 })
  viewCount: number;

  @Column({ default: 0 })
  likeCount: number;

  @Column({ default: 0 })
  commentCount: number;

  @Column({ default: 0 })
  shareCount: number;

  @Column({ type: 'jsonb', nullable: true })
  engagementMetrics: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  earnings: number;

  @Column({ default: false })
  isMonetized: boolean;

  @Column({ type: 'jsonb', nullable: true })
  monetizationSettings: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  accessControl: Record<string, any>;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ default: false })
  isSponsored: boolean;

  @Column({ nullable: true })
  sponsorInfo: string;

  @Column({ type: 'jsonb', nullable: true })
  customFields: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.content)
  @JoinColumn()
  creator: User;

  @ManyToOne(() => CreatorProfile, (profile) => profile.content)
  @JoinColumn()
  creatorProfile: CreatorProfile;

  @OneToMany(() => ContentAccess, (access) => access.content)
  accessRecords: ContentAccess[];

  // Virtual properties
  get isPublished(): boolean {
    return this.status === ContentStatus.PUBLISHED;
  }

  get isScheduled(): boolean {
    return this.status === ContentStatus.SCHEDULED;
  }

  get isArchived(): boolean {
    return this.status === ContentStatus.ARCHIVED;
  }

  get isPublic(): boolean {
    return this.visibility === ContentVisibility.PUBLIC;
  }

  get isSubscribersOnly(): boolean {
    return this.visibility === ContentVisibility.SUBSCRIBERS_ONLY;
  }

  get totalEngagement(): number {
    return this.viewCount + this.likeCount + this.commentCount + this.shareCount;
  }

  get engagementRate(): number {
    if (this.viewCount === 0) return 0;
    return (this.totalEngagement / this.viewCount) * 100;
  }
}
