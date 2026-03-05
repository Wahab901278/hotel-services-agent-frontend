import type {
  Hotel,
  Room,
  HotelPhoto,
  Booking,
  RFP,
  RFPProposal,
  HotelSearchParams,
  SearchResults,
  Conversation,
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Add auth token if available
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    if (token) {
      (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    }
  }

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(error.detail || `Request failed: ${res.status}`);
  }

  return res.json();
}

// ============================================================
// Hotels API
// ============================================================

export const hotelsApi = {
  search(params: HotelSearchParams): Promise<SearchResults<Hotel>> {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (Array.isArray(value)) {
          value.forEach((v) => query.append(key, v));
        } else {
          query.set(key, String(value));
        }
      }
    });
    return request(`/hotels/search?${query}`);
  },

  getById(hotelId: string): Promise<Hotel> {
    return request(`/hotels/${hotelId}`);
  },

  getRooms(hotelId: string): Promise<Room[]> {
    return request(`/hotels/${hotelId}/rooms`);
  },

  getPhotos(hotelId: string, roomType?: string): Promise<HotelPhoto[]> {
    const query = roomType ? `?room_type=${roomType}` : "";
    return request(`/hotels/${hotelId}/photos${query}`);
  },

  checkAvailability(
    hotelId: string,
    roomId: string,
    checkIn: string,
    checkOut: string
  ): Promise<{ available: boolean; price: number }> {
    return request(
      `/hotels/${hotelId}/availability?room_id=${roomId}&check_in=${checkIn}&check_out=${checkOut}`
    );
  },
};

// ============================================================
// Bookings API
// ============================================================

export const bookingsApi = {
  create(data: {
    hotel_id: string;
    room_id: string;
    check_in: string;
    check_out: string;
    guests: number;
    guest_name: string;
    guest_email: string;
    special_requests?: string;
  }): Promise<Booking> {
    return request("/bookings", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getById(bookingId: string): Promise<Booking> {
    return request(`/bookings/${bookingId}`);
  },

  getUserBookings(userId: string): Promise<Booking[]> {
    return request(`/bookings/user/${userId}`);
  },

  cancel(bookingId: string): Promise<Booking> {
    return request(`/bookings/${bookingId}`, { method: "DELETE" });
  },

  modify(
    bookingId: string,
    data: Partial<Booking>
  ): Promise<Booking> {
    return request(`/bookings/${bookingId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
};

// ============================================================
// RFP API
// ============================================================

export const rfpApi = {
  create(data: {
    company_name: string;
    contact_email: string;
    event_type: string;
    guest_count: number;
    check_in: string;
    check_out: string;
    budget_min?: number;
    budget_max?: number;
    requirements?: Record<string, unknown>;
  }): Promise<RFP> {
    return request("/rfp", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  upload(file: File): Promise<RFP> {
    const formData = new FormData();
    formData.append("file", file);
    return request("/rfp/upload", {
      method: "POST",
      headers: {}, // Let browser set content-type for FormData
      body: formData as unknown as string,
    });
  },

  getById(rfpId: string): Promise<RFP> {
    return request(`/rfp/${rfpId}`);
  },

  getProposals(rfpId: string): Promise<RFPProposal[]> {
    return request(`/rfp/${rfpId}/proposals`);
  },

  getUserRFPs(userId: string): Promise<RFP[]> {
    return request(`/rfp/user/${userId}`);
  },
};

// ============================================================
// Chat API (REST fallback)
// ============================================================

export const chatApi = {
  sendMessage(
    message: string,
    conversationId?: string
  ): Promise<{ response: string; conversation_id: string }> {
    return request("/chat/message", {
      method: "POST",
      body: JSON.stringify({ message, conversation_id: conversationId }),
    });
  },

  getHistory(conversationId: string): Promise<Conversation> {
    return request(`/chat/history/${conversationId}`);
  },
};

// ============================================================
// Auth API
// ============================================================

export const authApi = {
  login(
    email: string,
    password: string
  ): Promise<{ access_token: string; user: { id: string; email: string; name: string } }> {
    return request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  register(
    email: string,
    password: string,
    name: string
  ): Promise<{ access_token: string; user: { id: string; email: string; name: string } }> {
    return request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    });
  },

  refresh(): Promise<{ access_token: string }> {
    return request("/auth/refresh", { method: "POST" });
  },
};
