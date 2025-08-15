import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CreatorProfilesService, CreateCreatorProfileDto, UpdateCreatorProfileDto } from './creator-profiles.service';
import { CreatorProfile, CreatorCategory, VerificationStatus } from './entities/creator-profile.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('creator-profiles')
@Controller('creator-profiles')
export class CreatorProfilesController {
  constructor(private readonly creatorProfilesService: CreatorProfilesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new creator profile' })
  @ApiResponse({ status: 201, description: 'Creator profile created successfully', type: CreatorProfile })
  async create(@Body() createCreatorProfileDto: CreateCreatorProfileDto): Promise<CreatorProfile> {
    return this.creatorProfilesService.create(createCreatorProfileDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all creator profiles' })
  @ApiResponse({ status: 200, description: 'Creator profiles retrieved successfully', type: [CreatorProfile] })
  async findAll(): Promise<CreatorProfile[]> {
    return this.creatorProfilesService.findAll();
  }

  @Get('verified')
  @ApiOperation({ summary: 'Get all verified creator profiles' })
  @ApiResponse({ status: 200, description: 'Verified creator profiles retrieved successfully', type: [CreatorProfile] })
  async findVerifiedCreators(): Promise<CreatorProfile[]> {
    return this.creatorProfilesService.findVerifiedCreators();
  }

  @Get('top-earners')
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiOperation({ summary: 'Get top earning creators' })
  @ApiResponse({ status: 200, description: 'Top earners retrieved successfully', type: [CreatorProfile] })
  async findTopEarners(@Query('limit') limit: number = 10): Promise<CreatorProfile[]> {
    return this.creatorProfilesService.findTopEarners(limit);
  }

  @Get('top-creators')
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiOperation({ summary: 'Get top creators by subscriber count' })
  @ApiResponse({ status: 200, description: 'Top creators retrieved successfully', type: [CreatorProfile] })
  async findTopCreators(@Query('limit') limit: number = 10): Promise<CreatorProfile[]> {
    return this.creatorProfilesService.findTopCreators(limit);
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Get creator profiles by category' })
  @ApiResponse({ status: 200, description: 'Creator profiles retrieved successfully', type: [CreatorProfile] })
  async findByCategory(@Param('category') category: CreatorCategory): Promise<CreatorProfile[]> {
    return this.creatorProfilesService.findByCategory(category);
  }

  @Get('search')
  @ApiQuery({ name: 'tags', required: false, type: String, isArray: true })
  @ApiOperation({ summary: 'Search creator profiles by tags' })
  @ApiResponse({ status: 200, description: 'Creator profiles retrieved successfully', type: [CreatorProfile] })
  async findByTags(@Query('tags') tags: string[]): Promise<CreatorProfile[]> {
    return this.creatorProfilesService.findByTags(tags);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get creator profile by ID' })
  @ApiResponse({ status: 200, description: 'Creator profile retrieved successfully', type: CreatorProfile })
  @ApiResponse({ status: 404, description: 'Creator profile not found' })
  async findById(@Param('id') id: string): Promise<CreatorProfile> {
    return this.creatorProfilesService.findById(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get creator profile by user ID' })
  @ApiResponse({ status: 200, description: 'Creator profile retrieved successfully', type: CreatorProfile })
  @ApiResponse({ status: 404, description: 'Creator profile not found' })
  async findByUserId(@Param('userId') userId: string): Promise<CreatorProfile> {
    return this.creatorProfilesService.findByUserId(userId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update creator profile' })
  @ApiResponse({ status: 200, description: 'Creator profile updated successfully', type: CreatorProfile })
  @ApiResponse({ status: 404, description: 'Creator profile not found' })
  async update(
    @Param('id') id: string,
    @Body() updateCreatorProfileDto: UpdateCreatorProfileDto,
  ): Promise<CreatorProfile> {
    return this.creatorProfilesService.update(id, updateCreatorProfileDto);
  }

  @Patch(':id/verification-status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update creator verification status' })
  @ApiResponse({ status: 200, description: 'Verification status updated successfully', type: CreatorProfile })
  @ApiResponse({ status: 404, description: 'Creator profile not found' })
  async updateVerificationStatus(
    @Param('id') id: string,
    @Body('status') status: VerificationStatus,
  ): Promise<CreatorProfile> {
    return this.creatorProfilesService.updateVerificationStatus(id, status);
  }

  @Patch(':id/deactivate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deactivate creator profile' })
  @ApiResponse({ status: 200, description: 'Creator profile deactivated successfully', type: CreatorProfile })
  @ApiResponse({ status: 404, description: 'Creator profile not found' })
  async deactivate(
    @Param('id') id: string,
    @Body('reason') reason?: string,
  ): Promise<CreatorProfile> {
    return this.creatorProfilesService.deactivate(id, reason);
  }

  @Patch(':id/reactivate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reactivate creator profile' })
  @ApiResponse({ status: 200, description: 'Creator profile reactivated successfully', type: CreatorProfile })
  @ApiResponse({ status: 404, description: 'Creator profile not found' })
  async reactivate(@Param('id') id: string): Promise<CreatorProfile> {
    return this.creatorProfilesService.reactivate(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete creator profile' })
  @ApiResponse({ status: 200, description: 'Creator profile deleted successfully' })
  @ApiResponse({ status: 404, description: 'Creator profile not found' })
  async delete(@Param('id') id: string): Promise<void> {
    return this.creatorProfilesService.delete(id);
  }
}
