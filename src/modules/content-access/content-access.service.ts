import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContentAccess } from '@modules/content-access/entities/content-access.entity';

@Injectable()
export class ContentAccessService {
  constructor(
    @InjectRepository(ContentAccess)
    private readonly contentAccessRepository: Repository<ContentAccess>,
  ) {}

  findAll(): Promise<ContentAccess[]> {
    return this.contentAccessRepository.find({
      relations: ['content', 'user', 'subscriptionTier'],
    });
  }
}
