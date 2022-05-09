module.exports = () => `import Widget from '@s-ui/widget-embedder/react/Widget'
import Widgets from '@s-ui/widget-embedder/react/Widgets'
import render from '@s-ui/widget-embedder/react/render'
import './index.scss'

const bootstrap = async () => {
  render(
    <Widgets>
      <Widget selector="<node>">{/* YOUR COMPONENT GOES HERE */}</Widget>
    </Widgets>,
    'global'
  )
}

bootstrap()
`
