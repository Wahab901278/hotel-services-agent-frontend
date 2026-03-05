"use client";

import {
  CalendarCheck,
  MapPin,
  Users,
  Clock,
  XCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Booking } from "@/lib/types";

const statusConfig: Record<
  string,
  { color: "default" | "secondary" | "destructive"; label: string }
> = {
  pending: { color: "secondary", label: "Pending" },
  confirmed: { color: "default", label: "Confirmed" },
  cancelled: { color: "destructive", label: "Cancelled" },
};

interface BookingSummaryProps {
  booking: Booking;
  onCancel?: (bookingId: string) => void;
  showActions?: boolean;
}

export function BookingSummary({
  booking,
  onCancel,
  showActions = true,
}: BookingSummaryProps) {
  const nights = Math.ceil(
    (new Date(booking.check_out).getTime() -
      new Date(booking.check_in).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const status = statusConfig[booking.status] || statusConfig.pending;

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold">
              {booking.hotel?.name || "Hotel Booking"}
            </h3>
            {booking.hotel && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
                <MapPin className="h-3.5 w-3.5" />
                <span>
                  {booking.hotel.city}, {booking.hotel.country}
                </span>
              </div>
            )}
          </div>
          <Badge variant={status.color}>{status.label}</Badge>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Check-in</p>
              <p className="font-medium">{booking.check_in}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Check-out</p>
              <p className="font-medium">{booking.check_out}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Guests</p>
              <p className="font-medium">{booking.guests}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Duration</p>
              <p className="font-medium">
                {nights} night{nights !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Room info */}
        {booking.room && (
          <div className="rounded-md bg-muted px-3 py-2 text-sm">
            <span className="text-muted-foreground">Room: </span>
            <span className="font-medium">{booking.room.room_type}</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between border-t pt-3">
          <span className="text-sm text-muted-foreground">Total</span>
          <span className="text-lg font-bold">
            &euro;{booking.total_price.toFixed(2)}
          </span>
        </div>

        {/* Special requests */}
        {booking.special_requests && (
          <div className="text-sm">
            <p className="text-xs text-muted-foreground mb-0.5">
              Special Requests
            </p>
            <p>{booking.special_requests}</p>
          </div>
        )}

        {/* Actions */}
        {showActions && booking.status !== "cancelled" && onCancel && (
          <Button
            variant="outline"
            size="sm"
            className="w-full text-destructive hover:text-destructive"
            onClick={() => onCancel(booking.id)}
          >
            <XCircle className="mr-2 h-4 w-4" />
            Cancel Booking
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
