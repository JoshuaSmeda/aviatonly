import CodePreview from '@/app/components/shared/code-preview'
import ChartAreastacked from './code/stackedcode'

const ChartAreaStacked = () => {
  return (
    <>
      <CodePreview
        component={<ChartAreastacked />}
        title='Stacked'
        filePath='/app/components/charts/shadcn/area/code/stackedcode.tsx'
      />
    </>
  )
}

export default ChartAreaStacked
