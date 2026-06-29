import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@iconify/react";

export const metadata: Metadata = {
  title: "Sell Your Aircraft | AVIATONLY",
  description:
    "List your aircraft through AVIATONLY's structured, verified sales process.",
};

const STEPS = [
  {
    icon: "ph:airplane-tilt-fill",
    title: "Submit your aircraft",
    description:
      "Complete the guided intake wizard with airframe, engine, propeller, avionics, photos, and documents.",
  },
  {
    icon: "ph:shield-check-fill",
    title: "AVIATONLY review",
    description:
      "Our team reviews your data and documents, runs a pre-valuation, and schedules inspection where needed.",
  },
  {
    icon: "ph:gavel-fill",
    title: "Go live",
    description:
      "Your aircraft is published as a fixed-price listing or timed auction once approved.",
  },
];

const SellLandingPage = () => {
  return (
    <div className="container max-w-8xl mx-auto px-5 2xl:px-0 pt-32 md:pt-44 pb-14 md:pb-28">
      <div className="text-center mb-16">
        <div className="flex gap-2.5 items-center justify-center mb-3">
          <Icon icon="ph:airplane-takeoff-fill" width={20} height={20} className="text-primary" />
          <p className="text-base font-semibold text-badge dark:text-white/90">Sell aircraft</p>
        </div>
        <h1 className="text-4xl sm:text-52 font-medium tracking-tighter text-black dark:text-white mb-4 leading-10 sm:leading-14">
          Sell your aircraft the structured, verified way
        </h1>
        <p className="text-xm font-normal tracking-tight text-black/50 dark:text-white/50 leading-6 max-w-2xl mx-auto mb-8">
          AVIATONLY guides you through a high-quality intake process so buyers see trusted technical,
          legal, and operational detail. You submit for review — we control listing quality.
        </p>
        <div className="flex flex-col mobile:flex-row items-center justify-center gap-4">
          <Link
            href="/dashboard/seller/upload"
            className="px-8 py-4 rounded-full bg-primary text-white text-base font-semibold hover:bg-dark duration-300"
          >
            Start the intake wizard
          </Link>
          <Link
            href="/buy"
            className="px-8 py-4 rounded-full border border-black/10 dark:border-white/20 text-base font-semibold text-black dark:text-white hover:border-primary duration-300"
          >
            Browse aircraft
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {STEPS.map((step, index) => (
          <div
            key={step.title}
            className="border border-black/10 dark:border-white/15 rounded-2xl p-8"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon icon={step.icon} width={24} height={24} />
              </div>
              <span className="text-sm font-semibold text-black/30 dark:text-white/30">
                0{index + 1}
              </span>
            </div>
            <h5 className="text-xl font-medium tracking-tight text-black dark:text-white mb-2">
              {step.title}
            </h5>
            <p className="text-base text-black/50 dark:text-white/50">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellLandingPage;
