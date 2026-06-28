import CodePreview from "@/components/dashboard/shared/code-preview";
import ChartBarstacked from "./code/barstackedlegendcode";

const ChartBarStacked = () => {
  return (
    <>
      <CodePreview
        component={<ChartBarstacked />}
        title="Stacked + Legend"
        filePath="/app/components/charts/shadcn/bar/code/barstackedlegendcode.tsx"
      />
    </>
  );
};

export default ChartBarStacked;
