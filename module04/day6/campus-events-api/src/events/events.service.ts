import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { FindEventsQueryDto } from './dto/find-events-query.dto';
import { CampusEvent, PaginatedResponse, Session } from './interfaces/event.interface';

@Injectable()
export class EventsService {
  private events: CampusEvent[] = [
    {
      id: 'evt-101',
      title: 'Annual Tech Symposium 2026',
      description: 'A full-day conference featuring student tech projects, AI research demos, and industry keynote speakers.',
      location: 'Main Auditorium',
      eventDate: '2026-11-20T09:00:00.000Z',
      category: 'technology',
      isPublished: true,
    },
    {
      id: 'evt-102',
      title: 'Campus Career & Internship Fair',
      description: 'Connect with over 40 tech and business companies hiring interns and graduates.',
      location: 'Student Union Center',
      eventDate: '2026-11-25T10:00:00.000Z',
      category: 'career',
      isPublished: true,
    },
    {
      id: 'evt-103',
      title: 'Web Development Bootcamp with NestJS',
      description: 'Hands-on workshop building modern scalable backend REST APIs using NestJS and TypeScript.',
      location: 'Computer Science Building, Lab 102',
      eventDate: '2026-12-05T14:00:00.000Z',
      category: 'technology',
      isPublished: true,
    },
    {
      id: 'evt-104',
      title: 'Fall Inter-Department Football Cup',
      description: 'Inter-department sports tournament with soccer matches, athletics, and food trucks.',
      location: 'Campus Sports Arena',
      eventDate: '2026-10-15T08:00:00.000Z',
      category: 'sports',
      isPublished: true,
    },
    {
      id: 'evt-105',
      title: 'Student Photography & Fine Arts Gala',
      description: 'An exhibition celebrating creative student artwork, digital illustrations, and photography.',
      location: 'Fine Arts Gallery',
      eventDate: '2026-12-10T11:00:00.000Z',
      category: 'arts',
      isPublished: false,
    },
    {
      id: 'evt-106',
      title: 'Cloud Computing & DevOps Workshop',
      description: 'Learn Docker containerization and CI/CD pipelines hands-on.',
      location: 'Engineering Block, Room 2',
      eventDate: '2026-12-18T13:00:00.000Z',
      category: 'technology',
      isPublished: true,
    },
  ];

  private sessions: Session[] = [
    {
      id: 'ses-201',
      eventId: 'evt-101',
      title: 'Keynote: The Future of Agentic AI & Systems',
      startsAt: '09:30 AM',
      endsAt: '10:30 AM',
      room: 'Auditorium Hall A',
    },
    {
      id: 'ses-202',
      eventId: 'evt-101',
      title: 'Student Robotics & Embedded Systems Demo',
      startsAt: '11:00 AM',
      endsAt: '12:30 PM',
      room: 'Innovation Lab 3',
    },
    {
      id: 'ses-203',
      eventId: 'evt-102',
      title: 'Resume Review & Interview Preparation',
      startsAt: '10:30 AM',
      endsAt: '12:00 PM',
      room: 'Conference Room B',
    },
    {
      id: 'ses-204',
      eventId: 'evt-102',
      title: 'On-site Tech & Engineering Speed Interviews',
      startsAt: '01:00 PM',
      endsAt: '03:30 PM',
      room: 'Interview Hall',
    },
    {
      id: 'ses-205',
      eventId: 'evt-103',
      title: 'NestJS Architecture: Controllers, Modules & Services',
      startsAt: '02:00 PM',
      endsAt: '03:15 PM',
      room: 'Lab 102',
    },
    {
      id: 'ses-206',
      eventId: 'evt-103',
      title: 'Building DTOs, Validation and Query Filtering',
      startsAt: '03:30 PM',
      endsAt: '05:00 PM',
      room: 'Lab 102',
    },
  ];

  findAll(query: FindEventsQueryDto): PaginatedResponse<CampusEvent> {
    const {
      category,
      location,
      isPublished,
      sortBy,
      order = 'asc',
      page = 1,
      limit = 5,
      search,
      dateFrom,
      dateTo,
    } = query;

    // 1. Filter
    const filtered = this.events.filter((event) => {
      if (category && event.category.toLowerCase() !== category.trim().toLowerCase()) {
        return false;
      }

      if (location && !event.location.toLowerCase().includes(location.trim().toLowerCase())) {
        return false;
      }

      if (isPublished !== undefined && event.isPublished !== isPublished) {
        return false;
      }

      if (search) {
        const words = search.trim().toLowerCase().split(/\s+/);
        const titleLower = event.title.toLowerCase();
        if (!words.every((word) => titleLower.includes(word))) {
          return false;
        }
      }

      if (dateFrom) {
        const fromDate = new Date(dateFrom).getTime();
        if (!isNaN(fromDate) && new Date(event.eventDate).getTime() < fromDate) {
          return false;
        }
      }

      if (dateTo) {
        const toDate = new Date(dateTo).getTime();
        if (!isNaN(toDate) && new Date(event.eventDate).getTime() > toDate) {
          return false;
        }
      }

      return true;
    });

    const total = filtered.length;

    // 2. Sort a shallow copy so original array is not mutated
    const sorted = [...filtered];
    if (sortBy) {
      sorted.sort((a, b) => {
        let diff = 0;
        if (sortBy === 'eventDate') {
          diff = new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime();
        } else if (sortBy === 'title') {
          diff = a.title.localeCompare(b.title);
        }
        return order === 'desc' ? -diff : diff;
      });
    }

    // 3. Paginate
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const offset = (pageNum - 1) * limitNum;
    const items = sorted.slice(offset, offset + limitNum);
    const totalPages = Math.ceil(total / limitNum);

    return {
      items,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
    };
  }

  findUpcoming(): CampusEvent[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.events
      .filter((event) => new Date(event.eventDate).getTime() >= today.getTime())
      .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
  }

  findPublished(): CampusEvent[] {
    return this.events.filter((event) => event.isPublished);
  }

  findOne(id: string): CampusEvent {
    const event = this.events.find((e) => e.id === id);
    if (!event) {
      throw new NotFoundException(`Event with ID "${id}" was not found.`);
    }
    return event;
  }

  findSessionsByEvent(eventId: string): Session[] {
    this.findOne(eventId);
    return this.sessions.filter((s) => s.eventId === eventId);
  }

  findOneSession(eventId: string, sessionId: string): Session {
    this.findOne(eventId);

    const session = this.sessions.find(
      (s) => s.id === sessionId && s.eventId === eventId,
    );

    if (!session) {
      throw new NotFoundException(
        `Session with ID "${sessionId}" not found under event "${eventId}".`,
      );
    }

    return session;
  }

  create(dto: CreateEventDto): CampusEvent {
    const newEvent: CampusEvent = {
      id: `evt-${Date.now().toString().slice(-4)}`,
      ...dto,
    };

    this.events.push(newEvent);
    return newEvent;
  }
}
