import CodePreview from '@/app/components/shared/code-preview'
import ChartLineDotscustom from './code/customdotscode'

const ChartLineDotsCustom = () => {
  return (
    <>
      <CodePreview
        component={<ChartLineDotscustom />}
        title='Custom Dots'
        filePath='/app/components/charts/shadcn/line/code/customdotscode.tsx'
      />
    </>
  )
}

export default ChartLineDotsCustom
