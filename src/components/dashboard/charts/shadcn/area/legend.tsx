import CodePreview from '@/components/dashboard/shared/code-preview'
import ChartArealegend from './code/legendcode'

const ChartAreaLegend = () => {
  return (
    <>
      <CodePreview
        component={<ChartArealegend />}
        title='Legend'
        filePath='/app/components/charts/shadcn/area/code/legendcode.tsx'
      />
    </>
  )
}

export default ChartAreaLegend
