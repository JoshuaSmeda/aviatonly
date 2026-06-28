import CodePreview from '@/components/dashboard/shared/code-preview'
import ChartAreagradient from './code/gradientcode'

const ChartAreaGradient = () => {
  return (
    <>
      <CodePreview
        component={<ChartAreagradient />}
        title='Gradient'
        filePath='/app/components/charts/shadcn/area/code/gradientcode.tsx'
      />
    </>
  )
}

export default ChartAreaGradient
