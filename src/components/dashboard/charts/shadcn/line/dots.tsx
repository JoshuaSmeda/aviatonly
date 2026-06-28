import CodePreview from '@/components/dashboard/shared/code-preview'
import ChartLinedots from './code/dotscode'

const ChartLineDots = () => {
  return (
    <>
      <CodePreview
        component={<ChartLinedots />}
        title='Dots'
        filePath='/app/components/charts/shadcn/line/code/dotscode.tsx'
      />
    </>
  )
}

export default ChartLineDots
