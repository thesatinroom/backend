import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreatorProfile } from './entities/creator-profile.entity';
import { CreatorProfilesService } from './creator-profiles.service';
import { CreatorProfilesController } from './creator-profiles.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CreatorProfile])],
  controllers: [CreatorProfilesController],
  providers: [CreatorProfilesService],
  exports: [CreatorProfilesService, TypeOrmModule],
})
export class CreatorProfilesModule {}
