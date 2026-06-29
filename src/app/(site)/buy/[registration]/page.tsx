import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@iconify/react";

interface PageProps {
  params: Promise<{ registration: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { registration } = await params;
  return {
    title: `${registration.toUpperCase()} | AVIATONLY`,
    description: `Aircraft listing detail for ${registration.toUpperCase()} on AVIATONLY.`,
  };
}

const SPEC_TABS = [
  "Airframe",
  "Engine",
  "Propeller",
  "Avionics",
  "Interior",
  "Exterior",
  "Logbooks & Documents",
];

const AircraftDetailPage = async ({ params }: PageProps) => {
  const { registration } = await params;
  const reg = registration.toUpperCase();

  return (
    <div className="container max-w-8xl mx-auto px-5 2xl:px-0 pt-32 md:pt-44 pb-14 md:pb-28">
      <div className="flex items-center gap-2 text-sm text-black/50 dark:text-white/50 mb-6">
        <Link href="/buy" className="hover:text-primary">
          Browse aircraft
        </Link>
        <span>/</span>
        <span className="text-black dark:text-white">{reg}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="border border-dashed border-black/15 dark:border-white/15 rounded-2xl aspect-video flex flex-col items-center justify-center text-center px-6">
            <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
              <Icon icon="ph:images-square" width={28} height={28} />
            </div>
            <p className="text-base text-black/50 dark:text-white/50">
              High-resolution photo gallery for {reg} will appear here.
            </p>
          </div>

          <div>
            <h4 className="text-2xl font-medium tracking-tight text-black dark:text-white mb-4">
              Technical specifications
            </h4>
            <div className="flex flex-wrap gap-2 mb-5">
              {SPEC_TABS.map((tab) => (
                <span
                  key={tab}
                  className="px-4 py-2 rounded-full border border-black/10 dark:border-white/15 text-sm text-black/70 dark:text-white/70"
                >
                  {tab}
                </span>
              ))}
            </div>
            <div className="border border-dashed border-black/15 dark:border-white/15 rounded-2xl px-6 py-12 text-center text-black/50 dark:text-white/50">
              Airframe, engine, propeller, avionics, and document summaries are being prepared.
            </div>
          </div>
        </div>

        <aside className="flex flex-col gap-6">
          <div className="border border-black/10 dark:border-white/15 rounded-2xl p-6">
            <p className="text-sm font-semibold text-badge dark:text-white/90 mb-1">{reg}</p>
            <h3 className="text-3xl font-medium tracking-tight text-black dark:text-white mb-4">
              Aircraft summary
            </h3>
            <p className="text-base text-black/50 dark:text-white/50 mb-6">
              Year, make, model, registration type, location, and asking price or current bid will
              show here once this listing is published.
            </p>
            <button
              type="button"
              disabled
              className="w-full px-8 py-4 rounded-full bg-primary/40 text-white text-base font-semibold cursor-not-allowed"
            >
              Make an offer
            </button>
            <p className="mt-3 text-center text-xs text-black/40 dark:text-white/40">
              Inspection &amp; verification status pending.
            </p>
          </div>

          <div className="border border-dashed border-black/15 dark:border-white/15 rounded-2xl p-6 text-center text-black/50 dark:text-white/50">
            Finance calculator placeholder
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AircraftDetailPage;
