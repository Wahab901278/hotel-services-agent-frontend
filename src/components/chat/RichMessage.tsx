"use client";

import { Star, MapPin, CalendarCheck, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ChatMessage, Hotel, Booking, RFP } from "@/lib/types";

interface RichMessageProps {
  message: ChatMessage;
}

export function RichMessage({ message }: RichMessageProps) {
  switch (message.content_type) {
    case "hotel_results":
      return <HotelResults hotels={(message.data as Hotel[]) || []} />;
    case "booking_confirmation":
      return <BookingConfirmation booking={message.data as Booking} />;
    case "rfp_status":
      return <RFPStatusCard rfp={message.data as RFP} />;
    default:
      return (
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>
      );
  }
}

function HotelResults({ hotels }: { hotels: Hotel[] }) {
  if (hotels.length === 0) {
    return <p className="text-sm text-muted-foreground">No hotels found.</p>;
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium mb-2">
        Found {hotels.length} hotel{hotels.length !== 1 ? "s" : ""}:
      </p>
      {hotels.map((hotel, i) => (
        <Card key={hotel.id} className="bg-background/50">
          <CardContent className="p-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold">
                  {i + 1}. {hotel.name}
                </p>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>
                    {hotel.city}, {hotel.country}
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {Array.from({ length: hotel.star_rating }).map((_, j) => (
                    <Star
                      key={j}
                      className="h-3 w-3 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                  <span className="ml-1 text-xs text-muted-foreground">
                    ({hotel.avg_review}/5)
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">
                  &euro;{hotel.price_min}
                </p>
                <p className="text-[10px] text-muted-foreground">per night</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function BookingConfirmation({ booking }: { booking: Booking }) {
  if (!booking) return null;

  return (
    <Card className="bg-background/50">
      <CardContent className="p-3 space-y-2">
        <div className="flex items-center gap-2">
          <CalendarCheck className="h-4 w-4 text-green-500" />
          <p className="text-sm font-semibold">Booking Confirmed</p>
        </div>
        <div className="text-xs space-y-1 text-muted-foreground">
          <p>Booking ID: {booking.id}</p>
          <p>
            Check-in: {booking.check_in} &mdash; Check-out: {booking.check_out}
          </p>
          <p>Guests: {booking.guests}</p>
          <p className="font-medium text-foreground">
            Total: &euro;{booking.total_price}
          </p>
        </div>
        <Badge
          variant={
            booking.status === "confirmed" ? "default" : "secondary"
          }
        >
          {booking.status}
        </Badge>
      </CardContent>
    </Card>
  );
}

function RFPStatusCard({ rfp }: { rfp: RFP }) {
  if (!rfp) return null;

  const statusColors: Record<string, string> = {
    received: "bg-blue-100 text-blue-800",
    processing: "bg-yellow-100 text-yellow-800",
    proposals_ready: "bg-green-100 text-green-800",
    accepted: "bg-emerald-100 text-emerald-800",
    rejected: "bg-red-100 text-red-800",
  };

  return (
    <Card className="bg-background/50">
      <CardContent className="p-3 space-y-2">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          <p className="text-sm font-semibold">RFP #{rfp.id.slice(0, 8)}</p>
        </div>
        <div className="text-xs space-y-1 text-muted-foreground">
          <p>{rfp.company_name} &mdash; {rfp.event_type}</p>
          <p>{rfp.guest_count} guests</p>
          <p>
            {rfp.check_in} to {rfp.check_out}
          </p>
        </div>
        <span
          className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${statusColors[rfp.status] || "bg-gray-100 text-gray-800"}`}
        >
          {rfp.status.replace("_", " ")}
        </span>
      </CardContent>
    </Card>
  );
}
