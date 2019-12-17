const template = (code, config, state) => {
  return `import React, {memo} from 'react'
import AtomIcon from '@s-ui/react-atom-icon'

export default memo(props => <AtomIcon {...props}>${code}</AtomIcon>)
`
}

module.exports = template
