"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { HotelPhoto } from "@/lib/types";

interface PhotoGalleryProps {
  photos: HotelPhoto[];
}

export function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const sorted = [...photos].sort((a, b) => a.display_order - b.display_order);

  if (sorted.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border bg-muted">
        <p className="text-sm text-muted-foreground">No photos available</p>
      </div>
    );
  }

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const navigate = (direction: -1 | 1) => {
    setCurrentIndex((prev) => {
      const next = prev + direction;
      if (next < 0) return sorted.length - 1;
      if (next >= sorted.length) return 0;
      return next;
    });
  };

  return (
    <>
      {/* Grid layout */}
      <div className="grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {/* Primary photo - larger */}
        {sorted.length > 0 && (
          <button
            onClick={() => openLightbox(0)}
            className="col-span-2 row-span-2 relative overflow-hidden rounded-lg cursor-pointer group"
          >
            <img
              src={sorted[0].url}
              alt={sorted[0].caption}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
            {sorted[0].caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 p-2">
                <p className="text-xs text-white">{sorted[0].caption}</p>
              </div>
            )}
          </button>
        )}

        {/* Other photos */}
        {sorted.slice(1).map((photo, index) => (
          <button
            key={photo.id}
            onClick={() => openLightbox(index + 1)}
            className="relative h-40 overflow-hidden rounded-lg cursor-pointer group"
          >
            <img
              src={photo.url}
              alt={photo.caption}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {/* Lightbox dialog */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-4xl p-0 bg-black border-none">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10 text-white hover:bg-white/20"
              onClick={() => setLightboxOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>

            <img
              src={sorted[currentIndex]?.url}
              alt={sorted[currentIndex]?.caption}
              className="w-full max-h-[80vh] object-contain"
            />

            {sorted[currentIndex]?.caption && (
              <p className="absolute bottom-0 left-0 right-0 bg-black/60 p-3 text-sm text-white text-center">
                {sorted[currentIndex].caption}
              </p>
            )}

            {sorted.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={() => navigate(-1)}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={() => navigate(1)}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}

            {/* Dot indicators */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-1.5">
              {sorted.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    i === currentIndex ? "bg-white" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
