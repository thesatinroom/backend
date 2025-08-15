import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Analytics } from '@modules/analytics/entities/analytics.entity';
import { AnalyticsService } from '@modules/analytics/analytics.service';
import { AnalyticsController } from '@modules/analytics/analytics.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Analytics])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService, TypeOrmModule],
})
export class AnalyticsModule {}
