\import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AnalyticsService } from '@modules/analytics/analytics.service';
import { Analytics } from '@modules/analytics/entities/analytics.entity';

@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  findAll(): Promise<Analytics[]> {
    return this.analyticsService.findAll();
  }
}
