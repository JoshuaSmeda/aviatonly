import CodePreview from '@/components/dashboard/shared/code-preview'
import ChartAreainteractive from './code/interactivecode'

const ChartAreaInteractive = () => {
  return (
    <>
      <CodePreview
        component={<ChartAreainteractive />}
        title='Interactive'
        filePath='/app/components/charts/shadcn/area/code/interactivecode.tsx'
      />
    </>
  )
}

export default ChartAreaInteractive
