"use client";

import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Hotel, Room } from "@/lib/types";

const bookingSchema = z.object({
  guest_name: z.string().min(2, "Name is required"),
  guest_email: z.email("Invalid email address"),
  check_in: z.string().min(1, "Check-in date is required"),
  check_out: z.string().min(1, "Check-out date is required"),
  guests: z.number().min(1).max(20),
  special_requests: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  hotel: Hotel;
  room: Room;
  onSubmit: (data: BookingFormData) => Promise<void>;
  isLoading?: boolean;
}

export function BookingForm({
  hotel,
  room,
  onSubmit,
  isLoading,
}: BookingFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { guests: 1 },
  });

  const checkIn = watch("check_in");
  const checkOut = watch("check_out");

  const nights =
    checkIn && checkOut
      ? Math.max(
          0,
          Math.ceil(
            (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 0;

  const totalPrice = nights * room.price_per_night;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CalendarCheck className="h-5 w-5" />
          <h3 className="font-semibold">Book Your Stay</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          {hotel.name} &mdash; {room.room_type}
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Guest info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="guest_name">Full Name</Label>
              <Input
                id="guest_name"
                {...register("guest_name")}
                placeholder="John Smith"
              />
              {errors.guest_name && (
                <p className="text-xs text-destructive">
                  {errors.guest_name.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="guest_email">Email</Label>
              <Input
                id="guest_email"
                type="email"
                {...register("guest_email")}
                placeholder="john@email.com"
              />
              {errors.guest_email && (
                <p className="text-xs text-destructive">
                  {errors.guest_email.message}
                </p>
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="check_in">Check-in</Label>
              <Input id="check_in" type="date" {...register("check_in")} />
              {errors.check_in && (
                <p className="text-xs text-destructive">
                  {errors.check_in.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="check_out">Check-out</Label>
              <Input id="check_out" type="date" {...register("check_out")} />
              {errors.check_out && (
                <p className="text-xs text-destructive">
                  {errors.check_out.message}
                </p>
              )}
            </div>
          </div>

          {/* Guests */}
          <div className="space-y-1.5">
            <Label htmlFor="guests">Number of Guests</Label>
            <Input
              id="guests"
              type="number"
              min={1}
              max={room.max_guests}
              {...register("guests", { valueAsNumber: true })}
            />
            <p className="text-xs text-muted-foreground">
              Max {room.max_guests} guests
            </p>
          </div>

          {/* Special requests */}
          <div className="space-y-1.5">
            <Label htmlFor="special_requests">
              Special Requests (optional)
            </Label>
            <Textarea
              id="special_requests"
              {...register("special_requests")}
              placeholder="Late check-in, extra pillows..."
              rows={3}
            />
          </div>

          {/* Price summary */}
          {nights > 0 && (
            <div className="rounded-lg bg-muted p-3 space-y-1">
              <div className="flex justify-between text-sm">
                <span>
                  &euro;{room.price_per_night} x {nights} night
                  {nights !== 1 ? "s" : ""}
                </span>
                <span>&euro;{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-1">
                <span>Total</span>
                <span>&euro;{totalPrice.toFixed(2)}</span>
              </div>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm Booking
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
