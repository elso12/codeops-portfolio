import {
  Event,
  Session,
  PaginatedEvents,
  EventQueryParams,
  CreateEventInput,
} from "@/types/event";

const getBaseUrl = (): string => {
  const url =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";
  const trimmed = url.replace(/\/+$/, "");
  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
};

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${getBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
  const response = await fetch(url, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    ...init,
  });

  if (!response.ok) {
    let errorMessage = `Failed to fetch: ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData) {
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join(", ");
        } else if (typeof errorData.message === "string") {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      }
    } catch {
      // Non-JSON response body fallback
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return null as unknown as T;
  }

  return response.json();
}

export async function getEvents(
  params?: EventQueryParams
): Promise<PaginatedEvents> {
  const query = new URLSearchParams();

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        query.append(key, String(value));
      }
    });
  }

  const queryString = query.toString();
  return apiFetch<PaginatedEvents>(
    `/events${queryString ? `?${queryString}` : ""}`
  );
}

export async function getUpcomingEvents(): Promise<Event[]> {
  return apiFetch<Event[]>("/events/upcoming");
}

export async function getEventById(id: string): Promise<Event> {
  return apiFetch<Event>(`/events/${encodeURIComponent(id)}`);
}

export async function getEventSessions(id: string): Promise<Session[]> {
  return apiFetch<Session[]>(`/events/${encodeURIComponent(id)}/sessions`);
}

export async function getSessionById(
  eventId: string,
  sessionId: string
): Promise<Session> {
  return apiFetch<Session>(
    `/events/${encodeURIComponent(eventId)}/sessions/${encodeURIComponent(
      sessionId
    )}`
  );
}

export async function createEvent(event: CreateEventInput): Promise<Event> {
  return apiFetch<Event>("/events", {
    method: "POST",
    body: JSON.stringify(event),
  });
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
