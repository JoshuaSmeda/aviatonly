import CodePreview from '@/app/components/shared/code-preview'
import ChartBardefault from './code/bardefaultcode'

const ChartBarDefault = () => {
  return (
    <>
      <CodePreview
        component={<ChartBardefault />}
        title='Default'
        filePath='/app/components/charts/shadcn/bar/code/bardefaultcode.tsx'
      />
    </>
  )
}

export default ChartBarDefault
