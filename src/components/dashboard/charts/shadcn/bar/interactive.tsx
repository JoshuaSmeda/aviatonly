import CodePreview from '@/components/dashboard/shared/code-preview'
import ChartBarinteractive from './code/barinteractivecode'

const ChartBarInteractive = () => {
  return (
    <>
      <CodePreview
        component={<ChartBarinteractive />}
        title='Interactive'
        filePath='/app/components/charts/shadcn/bar/code/barinteractivecode.tsx'
      />
    </>
  )
}

export default ChartBarInteractive
