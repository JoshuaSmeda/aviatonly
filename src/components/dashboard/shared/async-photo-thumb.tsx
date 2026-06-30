"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { FileImage } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

interface AsyncPhotoThumbProps {
  src?: string | null;
  alt: string;
  /** Signed URL or metadata still loading — show skeleton + spinner. */
  pending?: boolean;
  className?: string;
}

const AsyncPhotoThumb = ({ src, alt, pending = false, className }: AsyncPhotoThumbProps) => {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setFailed(false);
  }, [src]);

  const waitingForUrl = pending || !src;
  const waitingForImage = Boolean(src) && !loaded && !failed;
  const showSpinner = waitingForUrl || waitingForImage;

  return (
    <div
      className={cn("relative size-12 shrink-0 overflow-hidden rounded bg-muted", className)}
      aria-busy={showSpinner}
    >
      {showSpinner ? (
        <>
          <Skeleton className="absolute inset-0 size-full rounded-none" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Spinner />
          </div>
        </>
      ) : null}

      {!showSpinner && (failed || !src) ? (
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
          <FileImage />
        </div>
      ) : null}

      {src && !failed ? (
        <Image
          src={src}
          alt={alt}
          width={48}
          height={48}
          unoptimized
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={cn(
            "size-full object-cover transition-[opacity,filter,transform] duration-300",
            loaded ? "opacity-100 blur-0 scale-100" : "opacity-0 blur-md scale-105",
          )}
        />
      ) : null}
    </div>
  );
};

export default AsyncPhotoThumb;
