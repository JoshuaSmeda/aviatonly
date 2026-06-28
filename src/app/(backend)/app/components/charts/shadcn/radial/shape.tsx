import CodePreview from "@/app/components/shared/code-preview";
import ChartRadialshape from "./code/radial-shapecode";

const ChartRadialShape = () => {
  return (
    <>
      <CodePreview
        component={<ChartRadialshape />}
        title="Shape"
        filePath="/app/components/charts/shadcn/radial/code/radial-shapecode.tsx"
      />
    </>
  );
};

export default ChartRadialShape;
