import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { APP_GUARD } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';

// Configuration
import { getDatabaseConfig } from './config/database.config';
import { getJwtConfig } from './config/jwt.config';

// Entities
import { User } from './modules/users/entities/user.entity';
import { CreatorProfile } from './modules/creator-profiles/entities/creator-profile.entity';
import { SubscriptionTier } from './modules/subscription-tiers/entities/subscription-tier.entity';
import { Subscription } from './modules/subscriptions/entities/subscription.entity';
import { Payment } from './modules/payments/entities/payment.entity';
import { Content } from './modules/content/entities/content.entity';
import { ContentAccess } from './modules/content-access/entities/content-access.entity';
import { Notification } from './modules/notifications/entities/notification.entity';
import { Analytics } from './modules/analytics/entities/analytics.entity';

// Modules
import { UsersModule } from '@modules/users/users.module';
import { AuthModule } from '@modules/auth/auth.module';
import { CreatorProfilesModule } from '@modules/creator-profiles/creator-profiles.module';
import { SubscriptionTiersModule } from '@modules/subscription-tiers/subscription-tiers.module';
import { SubscriptionsModule } from '@modules/subscriptions/subscriptions.module';
import { PaymentsModule } from '@modules/payments/payments.module';
import { ContentModule } from '@modules/content/content.module';
import { ContentAccessModule } from '@modules/content-access/content-access.module';
import { NotificationsModule } from '@modules/notifications/notifications.module';
import { AnalyticsModule } from '@modules/analytics/analytics.module';

// Guards
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import configuration from './config/configuration';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    // Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),

    // Authentication
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: getJwtConfig,
      inject: [ConfigService],
    }),

    // Feature Modules
    UsersModule,
    AuthModule,
    CreatorProfilesModule,
    SubscriptionTiersModule,
    SubscriptionsModule,
    PaymentsModule,
    ContentModule,
    ContentAccessModule,
    NotificationsModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
