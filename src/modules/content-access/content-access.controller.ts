import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ContentAccessService } from '@modules/content-access/content-access.service';
import { ContentAccess } from '@modules/content-access/entities/content-access.entity';

@ApiTags('content-access')
@Controller('content-access')
export class ContentAccessController {
  constructor(private readonly contentAccessService: ContentAccessService) {}

  @Get()
  findAll(): Promise<ContentAccess[]> {
    return this.contentAccessService.findAll();
  }
}
