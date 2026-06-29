import type { Metadata } from "next";
import BreadcrumbComp from "@/app/(dashboard)/dashboard/layout/shared/breadcrumb/breadcrumb-comp";
import TitleCard from "@/components/dashboard/shared/titleborder-card";
import AircraftIntakeWizard from "@/components/dashboard/seller/intake/aircraft-intake-wizard";
import IntakeResumeBanner from "@/components/dashboard/seller/intake/intake-resume-banner";
import { getIntakeFixContext } from "./actions";

export const metadata: Metadata = {
  title: "Sell Your Aircraft | AVIATONLY",
};

interface SellAircraftPageProps {
  searchParams: Promise<{
    listingId?: string;
    step?: string;
    fix?: string;
    fixPhoto?: string;
    fixDocument?: string;
  }>;
}

const SellAircraftPage = async ({ searchParams }: SellAircraftPageProps) => {
  const { listingId, step, fix, fixPhoto, fixDocument } = await searchParams;
  const initialStep =
    step != null && step !== "" ? Number.parseInt(step, 10) : undefined;

  const fixContext =
    listingId && (fix || fixPhoto || fixDocument)
      ? await getIntakeFixContext(listingId, { fix, fixPhoto, fixDocument })
      : null;

  return (
    <>
      <BreadcrumbComp title="Sell Your Aircraft" />
      <TitleCard
        title={
          fixContext
            ? "Fix requested item — intake wizard"
            : "Aircraft intake — submit for AVIATONLY review"
        }
      >
        {!fixContext ? <IntakeResumeBanner /> : null}
        <AircraftIntakeWizard
          listingId={listingId}
          initialStep={
            fixContext?.step ??
            (Number.isFinite(initialStep) ? initialStep : undefined)
          }
          fixContext={fixContext}
        />
      </TitleCard>
    </>
  );
};

export default SellAircraftPage;
