import CodePreview from "@/components/dashboard/shared/code-preview";
import ChartBarmixed from "./code/barmixedcode";

const ChartBarMixed = () => {
  return (
    <>
      <CodePreview
        component={<ChartBarmixed />}
        title="Mixed"
        filePath="/app/components/charts/shadcn/bar/code/barmixedcode.tsx"
      />
    </>
  );
};

export default ChartBarMixed;
