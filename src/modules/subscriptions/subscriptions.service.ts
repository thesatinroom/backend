import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Subscription,
  SubscriptionStatus,
} from './entities/subscription.entity';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {}

  async findAll(): Promise<Subscription[]> {
    return this.subscriptionRepository.find({
      relations: ['subscriber', 'tier'],
    });
  }

  async findById(id: string): Promise<Subscription> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id },
      relations: ['subscriber', 'tier'],
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    return subscription;
  }

  async findByUserId(userId: string): Promise<Subscription[]> {
    return this.subscriptionRepository.find({
      where: { subscriber: { id: userId } },
      relations: ['tier'],
    });
  }

  async findActiveSubscriptions(): Promise<Subscription[]> {
    return this.subscriptionRepository.find({
      where: { status: SubscriptionStatus.ACTIVE },
      relations: ['subscriber', 'tier'],
    });
  }

  async create(subscriptionData: Partial<Subscription>): Promise<Subscription> {
    const subscription = this.subscriptionRepository.create(subscriptionData);
    return this.subscriptionRepository.save(subscription);
  }

  async update(
    id: string,
    updateData: Partial<Subscription>,
  ): Promise<Subscription> {
    const subscription = await this.findById(id);
    Object.assign(subscription, updateData);
    return this.subscriptionRepository.save(subscription);
  }

  async cancel(id: string, reason?: string): Promise<Subscription> {
    const subscription = await this.findById(id);
    subscription.status = SubscriptionStatus.CANCELLED;
    subscription.cancelledAt = new Date();
    if (reason) {
      subscription.cancellationNote = reason;
    }
    return this.subscriptionRepository.save(subscription);
  }

  async delete(id: string): Promise<void> {
    const subscription = await this.findById(id);
    await this.subscriptionRepository.remove(subscription);
  }
}
