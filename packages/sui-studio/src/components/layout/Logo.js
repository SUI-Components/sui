import {getStudioLogo} from '../utils'

export default () => (
  <picture
    className="sui-Studio-logo"
    dangerouslySetInnerHTML={{__html: getStudioLogo()}}
  />
)
