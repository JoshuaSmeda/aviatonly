import CodePreview from '@/components/dashboard/shared/code-preview'
import ChartLinestep from './code/stepcode'

const ChartLineStep = () => {
  return (
    <>
      <CodePreview
        component={<ChartLinestep />}
        title='Step'
        filePath='/app/components/charts/shadcn/line/code/stepcode.tsx'
      />
    </>
  )
}

export default ChartLineStep
