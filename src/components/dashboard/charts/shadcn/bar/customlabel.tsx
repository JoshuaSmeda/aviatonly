import CodePreview from '@/components/dashboard/shared/code-preview'
import ChartBarLabelcustom from './code/barcustomlabelcode'

const ChartBarLabelCustom = () => {
  return (
    <>
      <CodePreview
        component={<ChartBarLabelcustom />}
        title='Custom Label'
        filePath='/app/components/charts/shadcn/bar/code/barcustomlabelcode.tsx'
      />
    </>
  )
}

export default ChartBarLabelCustom
