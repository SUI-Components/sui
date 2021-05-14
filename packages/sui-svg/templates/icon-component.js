const template = content => {
  return `import {memo} from 'react'
import AtomIcon from '@s-ui/react-atom-icon'

const MemoAtomIcon = memo(props => <AtomIcon {...props}>${content}</AtomIcon>)
MemoAtomIcon.displayName = 'AtomIcon'

export default MemoAtomIcon
`
}

module.exports = template
