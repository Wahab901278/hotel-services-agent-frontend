import { create } from "zustand";
import type {
  ChatMessage,
  Hotel,
  Booking,
  RFP,
  HotelSearchParams,
  User,
} from "./types";

// ============================================================
// Chat Store
// ============================================================

interface ChatState {
  messages: ChatMessage[];
  conversationId: string | null;
  isLoading: boolean;
  isVoiceActive: boolean;
  addMessage: (message: ChatMessage) => void;
  updateLastAssistantMessage: (content: string) => void;
  setConversationId: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setVoiceActive: (active: boolean) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  conversationId: null,
  isLoading: false,
  isVoiceActive: false,
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  updateLastAssistantMessage: (content) =>
    set((state) => {
      const messages = [...state.messages];
      const lastIdx = messages.findLastIndex((m) => m.role === "assistant");
      if (lastIdx >= 0) {
        messages[lastIdx] = { ...messages[lastIdx], content };
      }
      return { messages };
    }),
  setConversationId: (id) => set({ conversationId: id }),
  setLoading: (loading) => set({ isLoading: loading }),
  setVoiceActive: (active) => set({ isVoiceActive: active }),
  clearMessages: () => set({ messages: [], conversationId: null }),
}));

// ============================================================
// Hotel Search Store
// ============================================================

interface HotelSearchState {
  results: Hotel[];
  searchParams: HotelSearchParams;
  totalResults: number;
  isSearching: boolean;
  selectedHotel: Hotel | null;
  setResults: (results: Hotel[], total: number) => void;
  setSearchParams: (params: Partial<HotelSearchParams>) => void;
  setSearching: (searching: boolean) => void;
  setSelectedHotel: (hotel: Hotel | null) => void;
  clearSearch: () => void;
}

const defaultSearchParams: HotelSearchParams = {
  city: "",
  sort_by: "price_asc",
  page: 1,
  limit: 10,
};

export const useHotelSearchStore = create<HotelSearchState>((set) => ({
  results: [],
  searchParams: defaultSearchParams,
  totalResults: 0,
  isSearching: false,
  selectedHotel: null,
  setResults: (results, total) => set({ results, totalResults: total }),
  setSearchParams: (params) =>
    set((state) => ({
      searchParams: { ...state.searchParams, ...params },
    })),
  setSearching: (searching) => set({ isSearching: searching }),
  setSelectedHotel: (hotel) => set({ selectedHotel: hotel }),
  clearSearch: () =>
    set({
      results: [],
      searchParams: defaultSearchParams,
      totalResults: 0,
    }),
}));

// ============================================================
// Booking Store
// ============================================================

interface BookingState {
  bookings: Booking[];
  currentBooking: Booking | null;
  isLoading: boolean;
  setBookings: (bookings: Booking[]) => void;
  addBooking: (booking: Booking) => void;
  setCurrentBooking: (booking: Booking | null) => void;
  updateBooking: (id: string, updates: Partial<Booking>) => void;
  setLoading: (loading: boolean) => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  bookings: [],
  currentBooking: null,
  isLoading: false,
  setBookings: (bookings) => set({ bookings }),
  addBooking: (booking) =>
    set((state) => ({ bookings: [...state.bookings, booking] })),
  setCurrentBooking: (booking) => set({ currentBooking: booking }),
  updateBooking: (id, updates) =>
    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === id ? { ...b, ...updates } : b
      ),
    })),
  setLoading: (loading) => set({ isLoading: loading }),
}));

// ============================================================
// RFP Store
// ============================================================

interface RFPState {
  rfps: RFP[];
  currentRFP: RFP | null;
  isLoading: boolean;
  setRFPs: (rfps: RFP[]) => void;
  addRFP: (rfp: RFP) => void;
  setCurrentRFP: (rfp: RFP | null) => void;
  updateRFP: (id: string, updates: Partial<RFP>) => void;
  setLoading: (loading: boolean) => void;
}

export const useRFPStore = create<RFPState>((set) => ({
  rfps: [],
  currentRFP: null,
  isLoading: false,
  setRFPs: (rfps) => set({ rfps }),
  addRFP: (rfp) => set((state) => ({ rfps: [...state.rfps, rfp] })),
  setCurrentRFP: (rfp) => set({ currentRFP: rfp }),
  updateRFP: (id, updates) =>
    set((state) => ({
      rfps: state.rfps.map((r) =>
        r.id === id ? { ...r, ...updates } : r
      ),
    })),
  setLoading: (loading) => set({ isLoading: loading }),
}));

// ============================================================
// UI Store
// ============================================================

type ActiveView = "chat" | "hotels" | "bookings" | "rfp";

interface UIState {
  activeView: ActiveView;
  sidebarOpen: boolean;
  setActiveView: (view: ActiveView) => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeView: "chat",
  sidebarOpen: true,
  setActiveView: (view) => set({ activeView: view }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));

// ============================================================
// Auth Store
// ============================================================

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
