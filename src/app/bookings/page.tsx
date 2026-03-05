"use client";

import { useEffect } from "react";
import { CalendarCheck, Loader2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { BookingSummary } from "@/components/bookings/BookingSummary";
import { useBookingStore, useAuthStore } from "@/lib/store";
import { bookingsApi } from "@/lib/api";
import { toast } from "sonner";

export default function BookingsPage() {
  const { bookings, isLoading, setBookings, setLoading, updateBooking } =
    useBookingStore();
  const { user } = useAuthStore();

  useEffect(() => {
    async function loadBookings() {
      if (!user) return;
      setLoading(true);
      try {
        const data = await bookingsApi.getUserBookings(user.id);
        setBookings(data);
      } catch {
        toast.error("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    }
    loadBookings();
  }, [user, setBookings, setLoading]);

  const handleCancel = async (bookingId: string) => {
    try {
      await bookingsApi.cancel(bookingId);
      updateBooking(bookingId, { status: "cancelled" });
      toast.success("Booking cancelled");
    } catch {
      toast.error("Failed to cancel booking");
    }
  };

  return (
    <div className="flex h-full flex-col">
      <Header title="My Bookings" />

      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-3xl space-y-4">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {!isLoading && bookings.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <CalendarCheck className="h-12 w-12 text-muted-foreground/40 mb-4" />
              <h2 className="text-lg font-semibold mb-1">No Bookings Yet</h2>
              <p className="text-sm text-muted-foreground max-w-sm">
                Search for hotels and make your first booking, or ask the chat
                assistant to help you find the perfect stay.
              </p>
            </div>
          )}

          {bookings.map((booking) => (
            <BookingSummary
              key={booking.id}
              booking={booking}
              onCancel={handleCancel}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
