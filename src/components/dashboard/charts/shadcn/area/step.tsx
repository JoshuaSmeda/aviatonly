import CodePreview from '@/components/dashboard/shared/code-preview'
import ChartAreastep from './code/stepcode'

const ChartAreaStep = () => {
  return (
    <>
      <CodePreview
        component={<ChartAreastep />}
        title='Step'
        filePath='/app/components/charts/shadcn/area/code/stepcode.tsx'
      />
    </>
  )
}

export default ChartAreaStep
