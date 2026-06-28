import CodePreview from '@/components/dashboard/shared/code-preview'
import ChartAreaStackedexpand from './code/stackedexpandedcode'

const ChartAreaStackedExpand = () => {
  return (
    <>
      <CodePreview
        component={<ChartAreaStackedexpand />}
        title='Stacked Expanded'
        filePath='/app/components/charts/shadcn/area/code/stackedexpandedcode.tsx'
      />
    </>
  )
}

export default ChartAreaStackedExpand
