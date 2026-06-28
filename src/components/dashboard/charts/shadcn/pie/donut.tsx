import CodePreview from "@/components/dashboard/shared/code-preview";
import ChartPiedonut from "./code/donutcode";

const ChartPieDonut = () => {
  return (
    <>
      <CodePreview
        component={<ChartPiedonut />}
        title="Donut"
        filePath="/app/components/charts/shadcn/pie/code/donutcode.tsx"
      />
    </>
  );
};

export default ChartPieDonut;
