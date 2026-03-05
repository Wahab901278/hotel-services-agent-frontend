// ============================================================
// Core domain types for the Hotel Booking Agent
// ============================================================

// --- Hotels ---

export interface Hotel {
  id: string;
  name: string;
  city: string;
  country: string;
  star_rating: number;
  price_min: number;
  price_max: number;
  latitude: number;
  longitude: number;
  amenities: Record<string, boolean>;
  description: string;
  avg_review: number;
  total_reviews: number;
  created_at: string;
  photos?: HotelPhoto[];
}

export interface Room {
  id: string;
  hotel_id: string;
  room_type: string;
  price_per_night: number;
  max_guests: number;
  amenities: Record<string, boolean>;
  description: string;
  available: boolean;
  photos?: HotelPhoto[];
}

export interface HotelPhoto {
  id: string;
  room_id?: string;
  hotel_id: string;
  url: string;
  caption: string;
  is_primary: boolean;
  display_order: number;
}

// --- Bookings ---

export type BookingStatus = "pending" | "confirmed" | "cancelled";

export interface Booking {
  id: string;
  user_id: string;
  room_id: string;
  hotel_id: string;
  check_in: string;
  check_out: string;
  guests: number;
  total_price: number;
  status: BookingStatus;
  special_requests?: string;
  created_at: string;
  hotel?: Hotel;
  room?: Room;
}

// --- RFP ---

export type RFPStatus =
  | "received"
  | "processing"
  | "proposals_ready"
  | "accepted"
  | "rejected";

export interface RFP {
  id: string;
  company_name: string;
  contact_email: string;
  event_type: string;
  guest_count: number;
  check_in: string;
  check_out: string;
  budget_min?: number;
  budget_max?: number;
  requirements: Record<string, unknown>;
  raw_document_url?: string;
  status: RFPStatus;
  assigned_hotels?: unknown[];
  created_at: string;
  proposals?: RFPProposal[];
}

export interface RFPProposal {
  id: string;
  rfp_id: string;
  hotel_id: string;
  proposal_text: string;
  pricing: Record<string, unknown>;
  match_score: number;
  status: string;
  created_at: string;
  hotel?: Hotel;
}

// --- Chat ---

export type MessageRole = "user" | "assistant" | "system";

export type MessageContentType =
  | "text"
  | "hotel_results"
  | "hotel_photos"
  | "booking_confirmation"
  | "rfp_status"
  | "error";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  content_type: MessageContentType;
  data?: unknown;
  timestamp: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  messages: ChatMessage[];
  context: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

// --- Users ---

export interface User {
  id: string;
  email: string;
  name: string;
  preferences: Record<string, unknown>;
  created_at: string;
}

// --- Search ---

export interface HotelSearchParams {
  city: string;
  check_in?: string;
  check_out?: string;
  budget_min?: number;
  budget_max?: number;
  star_rating?: number;
  guests?: number;
  amenities?: string[];
  sort_by?: "price_asc" | "price_desc" | "rating" | "relevance";
  page?: number;
  limit?: number;
}

export interface SearchResults<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}
