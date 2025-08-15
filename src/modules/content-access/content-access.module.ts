import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentAccess } from '@modules/content-access/entities/content-access.entity';
import { ContentAccessService } from '@modules/content-access/content-access.service';
import { ContentAccessController } from '@modules/content-access/content-access.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ContentAccess])],
  controllers: [ContentAccessController],
  providers: [ContentAccessService],
  exports: [ContentAccessService, TypeOrmModule],
})
export class ContentAccessModule {}
