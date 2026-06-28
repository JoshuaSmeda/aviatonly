import CodePreview from '@/components/dashboard/shared/code-preview'
import ChartLinemultiple from './code/multiplecode'

const ChartLineMultiple = () => {
  return (
    <>
      <CodePreview
        component={<ChartLinemultiple />}
        title='Multiple'
        filePath='/app/components/charts/shadcn/line/code/multiplecode.tsx'
      />
    </>
  )
}

export default ChartLineMultiple
