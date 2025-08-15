import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriptionTier, BillingCycle, TierStatus } from './entities/subscription-tier.entity';

export interface CreateSubscriptionTierDto {
  creatorProfileId: string;
  name: string;
  description?: string;
  price: number;
  billingCycle: BillingCycle;
  features?: string[];
  benefits?: string[];
  maxSubscribers?: number;
  isPopular?: boolean;
  isCustom?: boolean;
  imageUrl?: string;
  discountPercentage?: number;
  discountValidUntil?: Date;
  customFields?: Record<string, any>;
}

export interface UpdateSubscriptionTierDto {
  name?: string;
  description?: string;
  price?: number;
  billingCycle?: BillingCycle;
  features?: string[];
  benefits?: string[];
  maxSubscribers?: number;
  isPopular?: boolean;
  isCustom?: boolean;
  imageUrl?: string;
  discountPercentage?: number;
  discountValidUntil?: Date;
  customFields?: Record<string, any>;
}

@Injectable()
export class SubscriptionTiersService {
  constructor(
    @InjectRepository(SubscriptionTier)
    private readonly subscriptionTierRepository: Repository<SubscriptionTier>,
  ) {}

  async create(createSubscriptionTierDto: CreateSubscriptionTierDto): Promise<SubscriptionTier> {
    const tier = this.subscriptionTierRepository.create({
      ...createSubscriptionTierDto,
      features: createSubscriptionTierDto.features || [],
      benefits: createSubscriptionTierDto.benefits || [],
      customFields: createSubscriptionTierDto.customFields || {},
    });

    return this.subscriptionTierRepository.save(tier);
  }

  async findAll(): Promise<SubscriptionTier[]> {
    return this.subscriptionTierRepository.find({
      relations: ['creatorProfile'],
      where: { status: TierStatus.ACTIVE },
    });
  }

  async findById(id: string): Promise<SubscriptionTier> {
    const tier = await this.subscriptionTierRepository.findOne({
      where: { id },
      relations: ['creatorProfile', 'subscriptions'],
    });

    if (!tier) {
      throw new NotFoundException('Subscription tier not found');
    }

    return tier;
  }

  async findByCreatorProfile(creatorProfileId: string): Promise<SubscriptionTier[]> {
    return this.subscriptionTierRepository.find({
      where: { creatorProfile: { id: creatorProfileId }, status: TierStatus.ACTIVE },
      relations: ['creatorProfile'],
      order: { price: 'ASC' },
    });
  }

  async findPopularTiers(): Promise<SubscriptionTier[]> {
    return this.subscriptionTierRepository.find({
      where: { isPopular: true, status: TierStatus.ACTIVE },
      relations: ['creatorProfile'],
    });
  }

  async update(id: string, updateSubscriptionTierDto: UpdateSubscriptionTierDto): Promise<SubscriptionTier> {
    const tier = await this.findById(id);

    Object.assign(tier, updateSubscriptionTierDto);
    return this.subscriptionTierRepository.save(tier);
  }

  async updateStatus(id: string, status: TierStatus): Promise<SubscriptionTier> {
    const tier = await this.findById(id);
    tier.status = status;
    return this.subscriptionTierRepository.save(tier);
  }

  async updateSubscriberCount(id: string, increment: boolean = true): Promise<SubscriptionTier> {
    const tier = await this.findById(id);
    tier.currentSubscribers += increment ? 1 : -1;
    return this.subscriptionTierRepository.save(tier);
  }

  async addDiscount(
    id: string, 
    discountPercentage: number, 
    validUntil: Date
  ): Promise<SubscriptionTier> {
    const tier = await this.findById(id);
    tier.discountPercentage = discountPercentage;
    tier.discountValidUntil = validUntil;
    return this.subscriptionTierRepository.save(tier);
  }

  async removeDiscount(id: string): Promise<SubscriptionTier> {
    const tier = await this.findById(id);
    tier.discountPercentage = null;
    tier.discountValidUntil = null;
    return this.subscriptionTierRepository.save(tier);
  }

  async delete(id: string): Promise<void> {
    const tier = await this.findById(id);
    
    // Check if there are active subscriptions
    if (tier.currentSubscribers > 0) {
      throw new BadRequestException('Cannot delete tier with active subscribers');
    }

    await this.subscriptionTierRepository.remove(tier);
  }

  async archive(id: string): Promise<SubscriptionTier> {
    const tier = await this.findById(id);
    tier.status = TierStatus.ARCHIVED;
    return this.subscriptionTierRepository.save(tier);
  }

  async findAvailableTiers(creatorProfileId: string): Promise<SubscriptionTier[]> {
    return this.subscriptionTierRepository.find({
      where: { 
        creatorProfile: { id: creatorProfileId }, 
        status: TierStatus.ACTIVE 
      },
      relations: ['creatorProfile'],
      order: { price: 'ASC' },
    });
  }

  async findTierWithDiscounts(creatorProfileId: string): Promise<SubscriptionTier[]> {
    return this.subscriptionTierRepository.find({
      where: { 
        creatorProfile: { id: creatorProfileId }, 
        status: TierStatus.ACTIVE,
        discountPercentage: () => 'IS NOT NULL',
        discountValidUntil: () => '> NOW()',
      },
      relations: ['creatorProfile'],
      order: { price: 'ASC' },
    });
  }

  async calculateRevenue(id: string): Promise<number> {
    const tier = await this.findById(id);
    const monthlyRevenue = tier.price * tier.currentSubscribers;
    
    if (tier.billingCycle === BillingCycle.QUARTERLY) {
      return monthlyRevenue * 3;
    } else if (tier.billingCycle === BillingCycle.YEARLY) {
      return monthlyRevenue * 12;
    }
    
    return monthlyRevenue;
  }
}
