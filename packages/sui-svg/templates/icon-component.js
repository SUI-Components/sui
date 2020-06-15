const template = (code, config, state) => {
  return `import React, {memo} from 'react'
import AtomIcon from '@s-ui/react-atom-icon'

const MemoAtomIcon = memo(props => <AtomIcon {...props}>${code}</AtomIcon>)
MemoAtomIcon.displayName = 'AtomIcon'

export default MemoAtomIcon
`
}

module.exports = template
