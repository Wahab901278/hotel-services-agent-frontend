"use client";

import { useEffect, useState } from "react";
import type { Hotel } from "@/lib/types";

// Dynamic import for Leaflet (SSR incompatible)
interface MapViewProps {
  hotels: Hotel[];
  center?: [number, number];
  zoom?: number;
  onHotelClick?: (hotel: Hotel) => void;
}

export function MapView({
  hotels,
  center,
  zoom = 12,
  onHotelClick,
}: MapViewProps) {
  const [MapComponents, setMapComponents] = useState<{
    MapContainer: typeof import("react-leaflet").MapContainer;
    TileLayer: typeof import("react-leaflet").TileLayer;
    Marker: typeof import("react-leaflet").Marker;
    Popup: typeof import("react-leaflet").Popup;
  } | null>(null);

  useEffect(() => {
    // Only import Leaflet on client side
    Promise.all([
      import("react-leaflet"),
      import("leaflet"),
      // @ts-expect-error -- CSS import has no type declarations
      import("leaflet/dist/leaflet.css"),
    ]).then(([rl, L]) => {
      // Fix default marker icons
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      setMapComponents({
        MapContainer: rl.MapContainer,
        TileLayer: rl.TileLayer,
        Marker: rl.Marker,
        Popup: rl.Popup,
      });
    });
  }, []);

  // Calculate center from hotels if not provided
  const mapCenter = center ||
    (hotels.length > 0
      ? [
          hotels.reduce((sum, h) => sum + h.latitude, 0) / hotels.length,
          hotels.reduce((sum, h) => sum + h.longitude, 0) / hotels.length,
        ] as [number, number]
      : [48.8566, 2.3522] as [number, number]); // Default to Paris

  if (!MapComponents) {
    return (
      <div className="flex h-full min-h-[300px] items-center justify-center rounded-lg border bg-muted">
        <p className="text-sm text-muted-foreground">Loading map...</p>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup } = MapComponents;

  return (
    <div className="h-full min-h-[300px] overflow-hidden rounded-lg border">
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {hotels.map((hotel) => (
          <Marker
            key={hotel.id}
            position={[hotel.latitude, hotel.longitude]}
            eventHandlers={{
              click: () => onHotelClick?.(hotel),
            }}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">{hotel.name}</p>
                <p className="text-muted-foreground">
                  &euro;{hotel.price_min}/night
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
