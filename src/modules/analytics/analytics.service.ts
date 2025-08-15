import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Analytics } from '@modules/analytics/entities/analytics.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Analytics)
    private readonly analyticsRepository: Repository<Analytics>,
  ) {}

  findAll(): Promise<Analytics[]> {
    return this.analyticsRepository.find({
      relations: ['user', 'creatorProfile', 'content'],
    });
  }
}
