import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { TimingInterceptor } from '../common/interceptors/timing.interceptor';
import { CreateEventDto } from './dto/create-event.dto';
import { FindEventsQueryDto } from './dto/find-events-query.dto';
import { EventsService } from './events.service';
import { CampusEvent, PaginatedResponse, Session } from './interfaces/event.interface';

@ApiTags('events')
@UseInterceptors(TimingInterceptor)
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @ApiOperation({ summary: 'List campus events with filtering, sorting, and pagination' })
  @ApiOkResponse({ description: 'Paginated list of campus events' })
  @ApiBadRequestResponse({ description: 'Invalid query parameters' })
  findAll(
    @Query() query: FindEventsQueryDto,
    @Res({ passthrough: true }) res: Response,
  ): PaginatedResponse<CampusEvent> {
    const result = this.eventsService.findAll(query);
    res.header('X-Total-Count', result.total.toString());
    return result;
  }

  @Get('example')
  @ApiOperation({ summary: 'Demonstrate ParseIntPipe parameter validation' })
  @ApiOkResponse({ description: 'Page received successfully' })
  @ApiBadRequestResponse({ description: 'Invalid integer input' })
  findPage(@Query('page', ParseIntPipe) page: number) {
    return {
      page,
      message: 'Page received successfully',
    };
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'List upcoming campus events' })
  @ApiOkResponse({ description: 'Array of upcoming campus events' })
  findUpcoming(): CampusEvent[] {
    return this.eventsService.findUpcoming();
  }

  @Get('published')
  @ApiOperation({ summary: 'List published campus events' })
  @ApiOkResponse({ description: 'Array of published campus events' })
  findPublished(): CampusEvent[] {
    return this.eventsService.findPublished();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single campus event by ID' })
  @ApiParam({ name: 'id', description: 'Campus event ID' })
  @ApiOkResponse({ description: 'Campus event details' })
  @ApiNotFoundResponse({ description: 'Campus event not found' })
  findOne(@Param('id') id: string): CampusEvent {
    return this.eventsService.findOne(id);
  }

  @Get(':id/sessions')
  @ApiOperation({ summary: 'List all sessions for a specific campus event' })
  @ApiParam({ name: 'id', description: 'Campus event ID' })
  @ApiOkResponse({ description: 'Array of sessions for the event' })
  @ApiNotFoundResponse({ description: 'Campus event not found' })
  findSessions(@Param('id') id: string): Session[] {
    return this.eventsService.findSessionsByEvent(id);
  }

  @Get(':id/sessions/:sessionId')
  @ApiOperation({ summary: 'Get a specific session within a campus event' })
  @ApiParam({ name: 'id', description: 'Campus event ID' })
  @ApiParam({ name: 'sessionId', description: 'Session ID' })
  @ApiOkResponse({ description: 'Session details' })
  @ApiNotFoundResponse({ description: 'Campus event or session not found' })
  findOneSession(
    @Param('id') id: string,
    @Param('sessionId') sessionId: string,
  ): Session {
    return this.eventsService.findOneSession(id, sessionId);
  }

  @Post()
  @UseGuards(ApiKeyGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new campus event (Protected by API Key Guard)' })
  @ApiHeader({ name: 'x-api-key', description: 'Classroom authorization API key', required: true })
  @ApiCreatedResponse({ description: 'Campus event successfully created' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized - Missing or invalid API key' })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  @ApiConflictResponse({ description: 'Conflicting campus event schedule' })
  create(@Body() createEventDto: CreateEventDto): CampusEvent {
    return this.eventsService.create(createEventDto);
  }
}