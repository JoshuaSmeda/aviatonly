import CodePreview from '@/components/dashboard/shared/code-preview'
import ChartLineLabelcustom from './code/customlabelcode'

const ChartLineLabelCustom = () => {
  return (
    <>
      <CodePreview
        component={<ChartLineLabelcustom />}
        title='Custom Label'
        filePath='/app/components/charts/shadcn/line/code/customlabelcode.tsx'
      />
    </>
  )
}

export default ChartLineLabelCustom
