import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatorProfile, CreatorCategory, VerificationStatus } from './entities/creator-profile.entity';

export interface CreateCreatorProfileDto {
  userId: string;
  bio?: string;
  description?: string;
  website?: string;
  socialMediaLinks?: Record<string, string>;
  category: CreatorCategory;
  tags?: string[];
  coverImage?: string;
  profileImage?: string;
  customFields?: Record<string, any>;
}

export interface UpdateCreatorProfileDto {
  bio?: string;
  description?: string;
  website?: string;
  socialMediaLinks?: Record<string, string>;
  category?: CreatorCategory;
  tags?: string[];
  coverImage?: string;
  profileImage?: string;
  customFields?: Record<string, any>;
}

@Injectable()
export class CreatorProfilesService {
  constructor(
    @InjectRepository(CreatorProfile)
    private readonly creatorProfileRepository: Repository<CreatorProfile>,
  ) {}

  async create(createCreatorProfileDto: CreateCreatorProfileDto): Promise<CreatorProfile> {
    const profile = this.creatorProfileRepository.create({
      ...createCreatorProfileDto,
      socialMediaLinks: createCreatorProfileDto.socialMediaLinks 
        ? JSON.stringify(createCreatorProfileDto.socialMediaLinks) 
        : null,
      tags: createCreatorProfileDto.tags || [],
      customFields: createCreatorProfileDto.customFields || {},
    });

    return this.creatorProfileRepository.save(profile);
  }

  async findAll(): Promise<CreatorProfile[]> {
    return this.creatorProfileRepository.find({
      relations: ['user', 'subscriptionTiers', 'content'],
      where: { isActive: true },
    });
  }

  async findById(id: string): Promise<CreatorProfile> {
    const profile = await this.creatorProfileRepository.findOne({
      where: { id },
      relations: ['user', 'subscriptionTiers', 'content'],
    });

    if (!profile) {
      throw new NotFoundException('Creator profile not found');
    }

    return profile;
  }

  async findByUserId(userId: string): Promise<CreatorProfile> {
    const profile = await this.creatorProfileRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user', 'subscriptionTiers', 'content'],
    });

    if (!profile) {
      throw new NotFoundException('Creator profile not found');
    }

    return profile;
  }

  async findByCategory(category: CreatorCategory): Promise<CreatorProfile[]> {
    return this.creatorProfileRepository.find({
      where: { category, isActive: true },
      relations: ['user', 'subscriptionTiers'],
    });
  }

  async findByTags(tags: string[]): Promise<CreatorProfile[]> {
    const queryBuilder = this.creatorProfileRepository.createQueryBuilder('profile');
    
    tags.forEach((tag, index) => {
      queryBuilder.andWhere(`profile.tags @> :tag${index}`, { [`tag${index}`]: JSON.stringify([tag]) });
    });

    return queryBuilder
      .leftJoinAndSelect('profile.user', 'user')
      .leftJoinAndSelect('profile.subscriptionTiers', 'tiers')
      .where('profile.isActive = :isActive', { isActive: true })
      .getMany();
  }

  async update(id: string, updateCreatorProfileDto: UpdateCreatorProfileDto): Promise<CreatorProfile> {
    const profile = await this.findById(id);

    if (updateCreatorProfileDto.socialMediaLinks) {
      updateCreatorProfileDto.socialMediaLinks = JSON.stringify(updateCreatorProfileDto.socialMediaLinks);
    }

    Object.assign(profile, updateCreatorProfileDto);
    return this.creatorProfileRepository.save(profile);
  }

  async updateVerificationStatus(id: string, status: VerificationStatus): Promise<CreatorProfile> {
    const profile = await this.findById(id);
    profile.verificationStatus = status;
    profile.isVerified = status === VerificationStatus.VERIFIED;
    return this.creatorProfileRepository.save(profile);
  }

  async updateEarnings(id: string, earnings: number): Promise<CreatorProfile> {
    const profile = await this.findById(id);
    profile.totalEarnings += earnings;
    profile.monthlyEarnings += earnings;
    return this.creatorProfileRepository.save(profile);
  }

  async updateSubscriberCount(id: string, increment: boolean = true): Promise<CreatorProfile> {
    const profile = await this.findById(id);
    profile.totalSubscribers += increment ? 1 : -1;
    return this.creatorProfileRepository.save(profile);
  }

  async updateContentCount(id: string, increment: boolean = true): Promise<CreatorProfile> {
    const profile = await this.findById(id);
    profile.totalContent += increment ? 1 : -1;
    return this.creatorProfileRepository.save(profile);
  }

  async deactivate(id: string, reason?: string): Promise<CreatorProfile> {
    const profile = await this.findById(id);
    profile.isActive = false;
    profile.deactivationReason = reason;
    return this.creatorProfileRepository.save(profile);
  }

  async reactivate(id: string): Promise<CreatorProfile> {
    const profile = await this.findById(id);
    profile.isActive = true;
    profile.deactivationReason = null;
    return this.creatorProfileRepository.save(profile);
  }

  async delete(id: string): Promise<void> {
    const profile = await this.findById(id);
    await this.creatorProfileRepository.remove(profile);
  }

  async findVerifiedCreators(): Promise<CreatorProfile[]> {
    return this.creatorProfileRepository.find({
      where: { 
        isVerified: true, 
        verificationStatus: VerificationStatus.VERIFIED,
        isActive: true 
      },
      relations: ['user', 'subscriptionTiers'],
    });
  }

  async findTopEarners(limit: number = 10): Promise<CreatorProfile[]> {
    return this.creatorProfileRepository.find({
      where: { isActive: true },
      relations: ['user'],
      order: { totalEarnings: 'DESC' },
      take: limit,
    });
  }

  async findTopCreators(limit: number = 10): Promise<CreatorProfile[]> {
    return this.creatorProfileRepository.find({
      where: { isActive: true },
      relations: ['user'],
      order: { totalSubscribers: 'DESC' },
      take: limit,
    });
  }
}
