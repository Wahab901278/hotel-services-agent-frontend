"use client";

import { useState, useCallback } from "react";
import { RowsPhotoAlbum } from "react-photo-album";
import "react-photo-album/rows.css";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/plugins/captions.css";
import type { HotelPhoto } from "@/lib/types";

interface PhotoGalleryProps {
  photos: HotelPhoto[];
}

export function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  const sorted = [...photos].sort((a, b) => a.display_order - b.display_order);

  // Convert to react-photo-album format
  const albumPhotos = sorted.map((photo) => ({
    src: photo.url,
    width: 800,
    height: 600,
    alt: photo.caption || "",
    title: photo.caption || undefined,
  }));

  // Convert to lightbox format
  const lightboxSlides = sorted.map((photo) => ({
    src: photo.url,
    alt: photo.caption || "",
    title: photo.caption || undefined,
    description: photo.caption || undefined,
  }));

  const handleClick = useCallback(
    ({ index }: { index: number }) => setLightboxIndex(index),
    []
  );

  if (sorted.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border bg-muted">
        <p className="text-sm text-muted-foreground">No photos available</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg overflow-hidden">
        <RowsPhotoAlbum
          photos={albumPhotos}
          targetRowHeight={200}
          rowConstraints={{ maxPhotos: 4 }}
          spacing={4}
          onClick={handleClick}
        />
      </div>

      <Lightbox
        slides={lightboxSlides}
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        close={() => setLightboxIndex(-1)}
        plugins={[Thumbnails, Zoom, Captions]}
      />
    </>
  );
}
