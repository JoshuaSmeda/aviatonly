import CodePreview from '@/components/dashboard/shared/code-preview'
import ChartLineinteractive from './code/interactivecode'

const ChartLineInteractive = () => {
  return (
    <>
      <CodePreview
        component={<ChartLineinteractive />}
        title='Interactive'
        filePath='/app/components/charts/shadcn/line/code/interactivecode.tsx'
      />
    </>
  )
}

export default ChartLineInteractive
