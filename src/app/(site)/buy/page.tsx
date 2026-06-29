import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@iconify/react";

export const metadata: Metadata = {
  title: "Browse Aircraft | AVIATONLY",
  description:
    "Browse verified fixed-price aircraft and live auctions on AVIATONLY.",
};

const BuyCatalogPage = () => {
  return (
    <div className="container max-w-8xl mx-auto px-5 2xl:px-0 pt-32 md:pt-44 pb-14 md:pb-28">
      <div className="mb-12">
        <div className="flex gap-2.5 items-center justify-center mb-3">
          <Icon icon="ph:airplane-tilt-fill" width={20} height={20} className="text-primary" />
          <p className="text-base font-semibold text-badge dark:text-white/90">Buy aircraft</p>
        </div>
        <div className="text-center">
          <h3 className="text-4xl sm:text-52 font-medium tracking-tighter text-black dark:text-white mb-3 leading-10 sm:leading-14">
            Browse verified aircraft &amp; live auctions
          </h3>
          <p className="text-xm font-normal tracking-tight text-black/50 dark:text-white/50 leading-6 max-w-2xl mx-auto">
            Every AVIATONLY listing is data-rich and inspection-backed. Filter by make, model, year,
            registration type, total time, and region — then act with confidence.
          </p>
        </div>
      </div>

      <div className="border border-dashed border-black/15 dark:border-white/15 rounded-2xl px-6 py-20 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary mb-5">
          <Icon icon="ph:magnifying-glass" width={28} height={28} />
        </div>
        <h5 className="text-2xl font-medium tracking-tight text-black dark:text-white mb-2">
          Catalog coming online
        </h5>
        <p className="text-base text-black/50 dark:text-white/50 max-w-xl mx-auto mb-8">
          The aircraft catalog and auction grid will appear here once the first verified listings go
          live. Filters, sorting, and listing cards are being wired up.
        </p>
        <div className="flex flex-col mobile:flex-row items-center justify-center gap-4">
          <Link
            href="/sell"
            className="px-8 py-4 rounded-full bg-primary text-white text-base font-semibold hover:bg-dark duration-300"
          >
            Sell your aircraft
          </Link>
          <Link
            href="/"
            className="px-8 py-4 rounded-full border border-black/10 dark:border-white/20 text-base font-semibold text-black dark:text-white hover:border-primary duration-300"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BuyCatalogPage;
