import {getStudioLogo} from '@s-ui/studio/src/components/utils'

export default () => (
  <picture
    className="sui-Studio-logo"
    dangerouslySetInnerHTML={{__html: getStudioLogo()}}
  />
)
