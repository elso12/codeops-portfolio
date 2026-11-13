import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateEventDto } from './dto/create-event.dto';
import { FindEventsQueryDto } from './dto/find-events-query.dto';
import { EventsService } from './events.service';
import { CampusEvent, PaginatedResponse, Session } from './interfaces/event.interface';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  /**
   * 1. GET /api/events
   * Supports filtering (category, location, isPublished, search, dateFrom, dateTo),
   * sorting (sortBy, order), and pagination (page, limit).
   * Sets the 'X-Total-Count' response header with the total matching count.
   */
  @Get()
  findAll(
    @Query() query: FindEventsQueryDto,
    @Res({ passthrough: true }) res: Response,
  ): PaginatedResponse<CampusEvent> {
    const result = this.eventsService.findAll(query);
    res.header('X-Total-Count', result.total.toString());
    return result;
  }

  /**
   * 2. GET /api/events/upcoming
   * STATIC ROUTE: Registered BEFORE dynamic route /:id to prevent NestJS
   * from matching "upcoming" as an event ID parameter.
   */
  @Get('upcoming')
  findUpcoming(): CampusEvent[] {
    return this.eventsService.findUpcoming();
  }

  /**
   * Stretch: GET /api/events/published
   * STATIC ROUTE: Also declared before /:id.
   */
  @Get('published')
  findPublished(): CampusEvent[] {
    return this.eventsService.findPublished();
  }

  /**
   * 3. GET /api/events/:id
   * DYNAMIC ROUTE: Retrieves one campus event by its ID.
   */
  @Get(':id')
  findOne(@Param('id') id: string): CampusEvent {
    return this.eventsService.findOne(id);
  }

  /**
   * 4. GET /api/events/:id/sessions
   * Retrieves all sessions belonging to the specified event ID.
   */
  @Get(':id/sessions')
  findSessions(@Param('id') id: string): Session[] {
    return this.eventsService.findSessionsByEvent(id);
  }

  /**
   * 5. GET /api/events/:id/sessions/:sessionId
   * Retrieves a single session by its session ID under the parent event ID.
   * Verifies both the event exists and the session belongs to it.
   */
  @Get(':id/sessions/:sessionId')
  findOneSession(
    @Param('id') id: string,
    @Param('sessionId') sessionId: string,
  ): Session {
    return this.eventsService.findOneSession(id, sessionId);
  }

  /**
   * 6. POST /api/events
   * Creates a new campus event with payload validation via ValidationPipe.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createEventDto: CreateEventDto): CampusEvent {
    return this.eventsService.create(createEventDto);
  }
}

