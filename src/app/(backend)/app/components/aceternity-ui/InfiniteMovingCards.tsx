"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: {
    imgLight: string;
    imgDark: string;
    href: string;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);

  useEffect(() => {
    addAnimation();
  }, []);
  const [start, setStart] = useState(false);
  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }
  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards"
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse"
        );
      }
    }
  };
  // const getSpeed = () => {
  //   if (containerRef.current) {
  //     if (speed === "fast") {
  //       containerRef.current.style.setProperty("--animation-duration", "20s");
  //     } else if (speed === "normal") {
  //       containerRef.current.style.setProperty("--animation-duration", "40s");
  //     } else {
  //       containerRef.current.style.setProperty("--animation-duration", "80s");
  //     }
  //   }
  // };

  const getSpeed = () => {
    if (!containerRef.current) return;

    if (speed === "fast") {
      containerRef.current.style.setProperty("--animation-duration", "40s");
    } else if (speed === "normal") {
      containerRef.current.style.setProperty("--animation-duration", "80s");
    } else {
      containerRef.current.style.setProperty("--animation-duration", "120s");
    }
  };
  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-10 max-w-full overflow-hidden",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-4",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"


        )}

      >
        {[...items, ...items, ...items].map((item, idx) => (
          <Link
            href={item?.href}
            className="relative w-[350px] max-w-full shrink-0 md:w-[676px]"
            key={idx}
          >
            <div>
              <img
                src={item.imgLight}
                alt="img"
                width={676}
                height={420}
                className="block dark:hidden"
              />
              <img
                src={item.imgDark}
                alt="img"
                width={676}
                height={420}
                className="hidden dark:block"
              />
            </div>
          </Link>
        ))}
      </ul>
    </div>
  );
};
