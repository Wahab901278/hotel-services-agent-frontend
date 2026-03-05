"use client";

import Link from "next/link";
import { Star, MapPin, Wifi, Car, Waves, Utensils } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Hotel } from "@/lib/types";

const amenityIcons: Record<string, React.ElementType> = {
  wifi: Wifi,
  parking: Car,
  pool: Waves,
  restaurant: Utensils,
};

interface HotelCardProps {
  hotel: Hotel;
}

export function HotelCard({ hotel }: HotelCardProps) {
  const primaryPhoto = hotel.photos?.find((p) => p.is_primary);
  const amenityKeys = hotel.amenities
    ? Object.entries(hotel.amenities)
        .filter(([, v]) => v)
        .map(([k]) => k)
    : [];

  return (
    <Link href={`/hotels/${hotel.id}`}>
      <Card className="overflow-hidden transition-shadow hover:shadow-lg">
        {/* Image placeholder */}
        <div className="relative h-48 bg-muted">
          {primaryPhoto ? (
            <img
              src={primaryPhoto.url}
              alt={hotel.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <span className="text-sm">No photo available</span>
            </div>
          )}
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
              &euro;{hotel.price_min}/night
            </Badge>
          </div>
        </div>

        <CardContent className="p-4 space-y-2">
          {/* Name & rating */}
          <div className="flex items-start justify-between">
            <h3 className="font-semibold leading-tight">{hotel.name}</h3>
            <div className="flex items-center gap-0.5 shrink-0 ml-2">
              {Array.from({ length: hotel.star_rating }).map((_, i) => (
                <Star
                  key={i}
                  className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span>
              {hotel.city}, {hotel.country}
            </span>
          </div>

          {/* Reviews */}
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">{hotel.avg_review}</span>
            <span className="text-muted-foreground">
              ({hotel.total_reviews} review{hotel.total_reviews !== 1 ? "s" : ""})
            </span>
          </div>

          {/* Amenities */}
          {amenityKeys.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {amenityKeys.slice(0, 4).map((key) => {
                const Icon = amenityIcons[key];
                return (
                  <Badge key={key} variant="outline" className="text-xs gap-1">
                    {Icon && <Icon className="h-3 w-3" />}
                    {key}
                  </Badge>
                );
              })}
              {amenityKeys.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{amenityKeys.length - 4}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
