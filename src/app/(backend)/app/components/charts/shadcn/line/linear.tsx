
import CodePreview from '@/app/components/shared/code-preview'
import ChartLinelinear from './code/linearcode'

const ChartLineLinear = () => {
  return (
    <>
      <CodePreview
        component={<ChartLinelinear />}
        title='Linear'
        filePath='/app/components/charts/shadcn/line/code/linearcode.tsx'
      />
    </>
  )
}

export default ChartLineLinear
