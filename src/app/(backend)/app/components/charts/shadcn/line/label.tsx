import CodePreview from '@/app/components/shared/code-preview'
import ChartLinelabel from './code/labelcode'

const ChartLineLabel = () => {
  return (
    <>
      <CodePreview
        component={<ChartLinelabel />}
        title='Label'
        filePath='/app/components/charts/shadcn/line/code/labelcode.tsx'
      />
    </>
  )
}

export default ChartLineLabel
