import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionTier } from './entities/subscription-tier.entity';
import { SubscriptionTiersService } from './subscription-tiers.service';
import { SubscriptionTiersController } from './subscription-tiers.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionTier])],
  controllers: [SubscriptionTiersController],
  providers: [SubscriptionTiersService],
  exports: [SubscriptionTiersService, TypeOrmModule],
})
export class SubscriptionTiersModule {}
