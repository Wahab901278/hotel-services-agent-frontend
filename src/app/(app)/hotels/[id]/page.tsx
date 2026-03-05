"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Star,
  MapPin,
  Wifi,
  Car,
  Waves,
  Utensils,
  Loader2,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { PhotoGallery } from "@/components/hotels/PhotoGallery";
import { BookingForm } from "@/components/bookings/BookingForm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { hotelsApi, bookingsApi } from "@/lib/api";
import type { Hotel, Room, HotelPhoto } from "@/lib/types";
import { toast } from "sonner";

const amenityIcons: Record<string, React.ElementType> = {
  wifi: Wifi,
  parking: Car,
  pool: Waves,
  restaurant: Utensils,
};

export default function HotelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const hotelId = params.id as string;

  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [photos, setPhotos] = useState<HotelPhoto[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    async function loadHotel() {
      try {
        const [hotelData, roomsData, photosData] = await Promise.all([
          hotelsApi.getById(hotelId),
          hotelsApi.getRooms(hotelId),
          hotelsApi.getPhotos(hotelId),
        ]);
        setHotel(hotelData);
        setRooms(roomsData);
        setPhotos(photosData);
      } catch {
        toast.error("Failed to load hotel details");
      } finally {
        setIsLoading(false);
      }
    }
    loadHotel();
  }, [hotelId]);

  const handleBooking = async (data: Record<string, unknown>) => {
    if (!selectedRoom || !hotel) return;
    setIsBooking(true);
    try {
      await bookingsApi.create({
        hotel_id: hotel.id,
        room_id: selectedRoom.id,
        check_in: data.check_in as string,
        check_out: data.check_out as string,
        guests: data.guests as number,
        guest_name: data.guest_name as string,
        guest_email: data.guest_email as string,
        special_requests: data.special_requests as string | undefined,
      });
      toast.success("Booking confirmed!");
      router.push("/bookings");
    } catch {
      toast.error("Failed to create booking");
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full flex-col">
        <Header title="Hotel Details" />
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="flex h-full flex-col">
        <Header title="Hotel Details" />
        <div className="flex flex-1 flex-col items-center justify-center">
          <p className="text-muted-foreground">Hotel not found</p>
          <Button variant="link" onClick={() => router.push("/hotels")}>
            Back to search
          </Button>
        </div>
      </div>
    );
  }

  const amenityKeys = hotel.amenities
    ? Object.entries(hotel.amenities)
        .filter(([, v]) => v)
        .map(([k]) => k)
    : [];

  return (
    <div className="flex h-full flex-col">
      <Header title={hotel.name} />

      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-5xl space-y-6">
          {/* Back button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/hotels")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to search
          </Button>

          {/* Hotel header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold">{hotel.name}</h1>
              <div className="flex items-center gap-3 mt-1 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {hotel.city}, {hotel.country}
                  </span>
                </div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: hotel.star_rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <span>
                  {hotel.avg_review}/5 ({hotel.total_reviews} reviews)
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">From</p>
              <p className="text-2xl font-bold">&euro;{hotel.price_min}</p>
              <p className="text-xs text-muted-foreground">per night</p>
            </div>
          </div>

          {/* Photo gallery */}
          <PhotoGallery photos={photos} />

          {/* Tabs: Info / Rooms / Book */}
          <Tabs defaultValue="info">
            <TabsList>
              <TabsTrigger value="info">Information</TabsTrigger>
              <TabsTrigger value="rooms">
                Rooms ({rooms.length})
              </TabsTrigger>
              <TabsTrigger value="book">Book</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-4 mt-4">
              <div>
                <h2 className="font-semibold mb-2">About</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {hotel.description}
                </p>
              </div>

              {amenityKeys.length > 0 && (
                <div>
                  <h2 className="font-semibold mb-2">Amenities</h2>
                  <div className="flex flex-wrap gap-2">
                    {amenityKeys.map((key) => {
                      const Icon = amenityIcons[key];
                      return (
                        <Badge
                          key={key}
                          variant="outline"
                          className="gap-1.5 py-1"
                        >
                          {Icon && <Icon className="h-3.5 w-3.5" />}
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="rooms" className="space-y-3 mt-4">
              {rooms.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No rooms available
                </p>
              ) : (
                rooms.map((room) => (
                  <Card
                    key={room.id}
                    className={`cursor-pointer transition-colors ${
                      selectedRoom?.id === room.id
                        ? "border-primary"
                        : "hover:border-muted-foreground/30"
                    }`}
                    onClick={() => setSelectedRoom(room)}
                  >
                    <CardContent className="flex items-center justify-between p-4">
                      <div>
                        <h3 className="font-medium">{room.room_type}</h3>
                        <p className="text-sm text-muted-foreground">
                          Up to {room.max_guests} guest
                          {room.max_guests !== 1 ? "s" : ""}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {room.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">
                          &euro;{room.price_per_night}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          per night
                        </p>
                        <Badge
                          variant={room.available ? "default" : "destructive"}
                          className="mt-1"
                        >
                          {room.available ? "Available" : "Unavailable"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="book" className="mt-4">
              {selectedRoom ? (
                <BookingForm
                  hotel={hotel}
                  room={selectedRoom}
                  onSubmit={handleBooking}
                  isLoading={isBooking}
                />
              ) : (
                <div className="rounded-lg border border-dashed p-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    Please select a room from the &quot;Rooms&quot; tab first.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
