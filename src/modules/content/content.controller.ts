import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ContentService } from '@modules/content/content.service';
import { Content } from '@modules/content/entities/content.entity';

@ApiTags('content')
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get()
  findAll(): Promise<Content[]> {
    return this.contentService.findAll();
  }
}
