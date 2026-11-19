import {
  Event,
  Session,
  PaginatedEvents,
  EventQueryParams,
  CreateEventInput,
} from '../types/event';

const getBaseUrl = (): string => {
  const url =
    process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';
  const trimmed = url.replace(/\/+$/, '');
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
};

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `Failed to fetch: ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData) {
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join(', ');
        } else if (typeof errorData.message === 'string') {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      }
    } catch {
      // Fallback if response body cannot be parsed as JSON
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return null as unknown as T;
  }

  return response.json();
}

/**
 * Fetch paginated list of campus events with optional query parameters.
 * GET /api/events
 */
export async function getEvents(
  params?: EventQueryParams
): Promise<PaginatedEvents> {
  const query = new URLSearchParams();

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, String(value));
      }
    });
  }

  const queryString = query.toString();
  const url = `${getBaseUrl()}/events${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  return handleResponse<PaginatedEvents>(response);
}

/**
 * Fetch upcoming campus events.
 * GET /api/events/upcoming
 */
export async function getUpcomingEvents(): Promise<Event[]> {
  const url = `${getBaseUrl()}/events/upcoming`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  return handleResponse<Event[]>(response);
}

/**
 * Fetch a single campus event by ID.
 * GET /api/events/:id
 */
export async function getEventById(id: string): Promise<Event> {
  const url = `${getBaseUrl()}/events/${encodeURIComponent(id)}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  return handleResponse<Event>(response);
}

/**
 * Fetch all sessions for a specific campus event.
 * GET /api/events/:id/sessions
 */
export async function getEventSessions(id: string): Promise<Session[]> {
  const url = `${getBaseUrl()}/events/${encodeURIComponent(id)}/sessions`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  return handleResponse<Session[]>(response);
}

/**
 * Fetch a specific session under a campus event.
 * GET /api/events/:id/sessions/:sessionId
 */
export async function getSessionById(
  eventId: string,
  sessionId: string
): Promise<Session> {
  const url = `${getBaseUrl()}/events/${encodeURIComponent(eventId)}/sessions/${encodeURIComponent(sessionId)}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  return handleResponse<Session>(response);
}

/**
 * Create a new campus event.
 * POST /api/events
 */
export async function createEvent(event: CreateEventInput): Promise<Event> {
  const url = `${getBaseUrl()}/events`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
    cache: 'no-store',
  });

  return handleResponse<Event>(response);
}

export const eventService = {
  getEvents,
  getUpcomingEvents,
  getEventById,
  getEventSessions,
  getSessionById,
  createEvent,
};

export default eventService;
