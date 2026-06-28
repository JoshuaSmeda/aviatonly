import CodePreview from '@/components/dashboard/shared/code-preview'
import ChartArealinear from './code/linearcode'

const ChartAreaLinear = () => {
  return (
    <>
      <CodePreview
        component={<ChartArealinear />}
        title='Linear'
        filePath='/app/components/charts/shadcn/area/code/linearcode.tsx'
      />
    </>
  )
}

export default ChartAreaLinear
