"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Images, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
} from "@/components/ui/dialog";
import type { AircraftListingImage } from "@/lib/aviatonly/marketplace/aircraft-marketplace-types";
import { cn } from "@/lib/utils";

interface AircraftImageGalleryProps {
  images: AircraftListingImage[];
  registration: string;
}

const detailCardClass = "overflow-hidden rounded-xl border border-border bg-card";

export function AircraftImageGallery({ images }: AircraftImageGalleryProps) {
  const initialIndex = Math.max(0, images.findIndex((image) => image.isPrimary));
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [carouselIndex, setCarouselIndex] = useState(initialIndex);
  const [galleryOpen, setGalleryOpen] = useState(false);

  if (images.length === 0) {
    return (
      <div
        className={cn(
          detailCardClass,
          "flex min-h-[280px] items-center justify-center text-muted-foreground",
        )}
      >
        Aircraft photos pending
      </div>
    );
  }

  const primary = images[activeIndex] ?? images[0];
  const thumbnailIndices = images
    .map((_, index) => index)
    .filter((index) => index !== activeIndex)
    .slice(0, 4);

  const openGallery = (index: number) => {
    setCarouselIndex(index);
    setGalleryOpen(true);
  };

  const goToPrevious = () => {
    setCarouselIndex((index) => (index - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCarouselIndex((index) => (index + 1) % images.length);
  };

  const carouselImage = images[carouselIndex] ?? images[0];

  return (
    <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
      <div className={cn(detailCardClass, "relative p-2")}>
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-4 lg:grid-rows-2">
          <button
            type="button"
            className="relative col-span-2 row-span-2 min-h-[220px] overflow-hidden rounded-lg bg-muted sm:min-h-[300px] lg:min-h-[400px]"
            onClick={() => openGallery(activeIndex)}
          >
            <Image
              src={primary.url}
              alt={primary.alt}
              fill
              className="object-cover"
              sizes="(max-width: 1280px) 80vw, 900px"
              priority
            />
          </button>

          {thumbnailIndices.map((imageIndex) => {
            const image = images[imageIndex];

            return (
              <button
                key={image.id}
                type="button"
                className="relative min-h-[110px] overflow-hidden rounded-lg bg-muted sm:min-h-[140px] lg:min-h-0"
                onClick={() => setActiveIndex(imageIndex)}
              >
                <Image src={image.url} alt={image.alt} fill className="object-cover" sizes="200px" />
              </button>
            );
          })}
        </div>

        {images.length > 1 ? (
          <button
            type="button"
            className="absolute bottom-4 right-4 z-10 inline-flex items-center gap-1.5 rounded-md bg-background/95 px-2.5 py-1.5 text-xs font-medium text-foreground shadow-sm ring-1 ring-border backdrop-blur-sm transition-colors hover:bg-background"
            onClick={() => openGallery(activeIndex)}
          >
            <Images className="size-3.5" />
            {images.length} photos
          </button>
        ) : null}
      </div>

      <DialogContent
        showCloseButton={false}
        className="max-w-5xl gap-0 overflow-hidden border-0 bg-transparent p-0 shadow-none ring-0 sm:max-w-5xl"
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-black">
          <Image
            src={carouselImage.url}
            alt={carouselImage.alt}
            fill
            className="object-cover"
            sizes="90vw"
            priority
          />

          <DialogClose
            render={
              <button
                type="button"
                className="absolute top-3 right-3 z-10 inline-flex size-9 items-center justify-center rounded-full bg-background/95 text-foreground shadow-sm ring-1 ring-border backdrop-blur-sm transition-colors hover:bg-background"
                aria-label="Close gallery"
              >
                <X className="size-4" />
              </button>
            }
          />

          {images.length > 1 ? (
            <>
              <button
                type="button"
                onClick={goToPrevious}
                className="absolute top-1/2 left-3 z-10 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/95 text-foreground shadow-sm ring-1 ring-border backdrop-blur-sm transition-colors hover:bg-background"
                aria-label="Previous photo"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={goToNext}
                className="absolute top-1/2 right-3 z-10 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/95 text-foreground shadow-sm ring-1 ring-border backdrop-blur-sm transition-colors hover:bg-background"
                aria-label="Next photo"
              >
                <ChevronRight className="size-5" />
              </button>
            </>
          ) : null}

          <div className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/55 px-3 py-1 text-xs font-medium text-white">
            {carouselIndex + 1} / {images.length}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
