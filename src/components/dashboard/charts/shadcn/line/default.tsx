import ChartLinedefault from './code/defaultcode'
import CodePreview from '@/components/dashboard/shared/code-preview'

const ChartLineDefault = () => {
  return (
    <>
      <CodePreview
        component={<ChartLinedefault />}
        title='Default'
        filePath='/app/components/charts/shadcn/line/code/defaultcode.tsx'
      />
    </>
  )
}

export default ChartLineDefault
