import CodePreview from "@/app/components/shared/code-preview";
import ChartRadialsimple from "./code/radial-defaultcode";

const ChartRadialSimple = () => {
  return (
    <>
      <CodePreview
        component={<ChartRadialsimple />}
        title="Default"
        filePath="/app/components/charts/shadcn/radial/code/radial-defaultcode.tsx"
      />
    </>
  );
};

export default ChartRadialSimple;
