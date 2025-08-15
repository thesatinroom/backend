import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '@modules/users/entities/user.entity';

export enum NotificationType {
  SUBSCRIPTION_RENEWAL = 'subscription_renewal',
  PAYMENT_SUCCESS = 'payment_success',
  PAYMENT_FAILED = 'payment_failed',
  NEW_CONTENT = 'new_content',
  CONTENT_UPDATE = 'content_update',
  SUBSCRIBER_JOINED = 'subscriber_joined',
  SUBSCRIBER_LEFT = 'subscriber_left',
  EARNING_UPDATE = 'earning_update',
  VERIFICATION_STATUS = 'verification_status',
  SYSTEM_ANNOUNCEMENT = 'system_announcement',
  SECURITY_ALERT = 'security_alert',
  OTHER = 'other',
}

export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum NotificationStatus {
  UNREAD = 'unread',
  READ = 'read',
  ARCHIVED = 'archived',
  DELETED = 'deleted',
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  message: string;

  @Column({
    type: 'enum',
    enum: NotificationType,
    default: NotificationType.OTHER,
  })
  type: NotificationType;

  @Column({
    type: 'enum',
    enum: NotificationPriority,
    default: NotificationPriority.MEDIUM,
  })
  priority: NotificationPriority;

  @Column({
    type: 'enum',
    enum: NotificationStatus,
    default: NotificationStatus.UNREAD,
  })
  status: NotificationStatus;

  @Column({ type: 'jsonb', nullable: true })
  data: Record<string, any>;

  @Column({ nullable: true })
  actionUrl: string;

  @Column({ nullable: true })
  actionText: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  icon: string;

  @Column({ default: false })
  isRead: boolean;

  @Column({ nullable: true })
  readAt: Date;

  @Column({ nullable: true })
  archivedAt: Date;

  @Column({ nullable: true })
  deletedAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @Column({ default: false })
  isPushSent: boolean;

  @Column({ nullable: true })
  pushSentAt: Date;

  @Column({ default: false })
  isEmailSent: boolean;

  @Column({ nullable: true })
  emailSentAt: Date;

  @Column({ default: false })
  isSmsSent: boolean;

  @Column({ nullable: true })
  smsSentAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn()
  recipient: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn()
  sender: User;

  // Virtual properties
  get isUnread(): boolean {
    return this.status === NotificationStatus.UNREAD;
  }

  get isArchived(): boolean {
    return this.status === NotificationStatus.ARCHIVED;
  }

  get isDeleted(): boolean {
    return this.status === NotificationStatus.DELETED;
  }

  get hasAction(): boolean {
    return !!(this.actionUrl && this.actionText);
  }

  get ageInMinutes(): number {
    const now = new Date();
    const timeDiff = now.getTime() - this.createdAt.getTime();
    return Math.floor(timeDiff / (1000 * 60));
  }

  get ageInHours(): number {
    return Math.floor(this.ageInMinutes / 60);
  }

  get ageInDays(): number {
    return Math.floor(this.ageInHours / 24);
  }
}
