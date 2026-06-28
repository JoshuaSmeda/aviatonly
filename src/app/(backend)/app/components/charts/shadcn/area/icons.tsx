import CodePreview from '@/app/components/shared/code-preview'
import ChartAreaicons from './code/iconscode'

const ChartAreaIcons = () => {
  return (
    <>
      <CodePreview
        component={<ChartAreaicons />}
        title='Icons'
        filePath='/app/components/charts/shadcn/area/code/iconscode.tsx'
      />
    </>
  )
}

export default ChartAreaIcons
