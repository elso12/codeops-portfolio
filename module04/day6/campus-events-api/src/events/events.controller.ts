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

  @Get()
  findAll(
    @Query() query: FindEventsQueryDto,
    @Res({ passthrough: true }) res: Response,
  ): PaginatedResponse<CampusEvent> {
    const result = this.eventsService.findAll(query);
    res.header('X-Total-Count', result.total.toString());
    return result;
  }

  // Static routes declared before dynamic :id route
  @Get('upcoming')
  findUpcoming(): CampusEvent[] {
    return this.eventsService.findUpcoming();
  }

  @Get('published')
  findPublished(): CampusEvent[] {
    return this.eventsService.findPublished();
  }

  @Get(':id')
  findOne(@Param('id') id: string): CampusEvent {
    return this.eventsService.findOne(id);
  }

  @Get(':id/sessions')
  findSessions(@Param('id') id: string): Session[] {
    return this.eventsService.findSessionsByEvent(id);
  }

  @Get(':id/sessions/:sessionId')
  findOneSession(
    @Param('id') id: string,
    @Param('sessionId') sessionId: string,
  ): Session {
    return this.eventsService.findOneSession(id, sessionId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createEventDto: CreateEventDto): CampusEvent {
    return this.eventsService.create(createEventDto);
  }
}
