import CodePreview from '@/components/dashboard/shared/code-preview'
import ChartBaractive from './code/baractivecode'

const ChartBarActive = () => {
  return (
    <>
      <CodePreview
        component={<ChartBaractive />}
        title='Active'
        filePath='/app/components/charts/shadcn/bar/code/baractivecode.tsx'
      />
    </>
  )
}

export default ChartBarActive
