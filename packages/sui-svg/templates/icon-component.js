const template = content => {
  return `import {memo} from 'react'
import AtomIcon from '@s-ui/react-atom-icon'

const MemoAtomIcon = memo(props =>
  <AtomIcon {...props}>
    <span dangerouslySetInnerHTML={{ __html: '${content}' }} />
  </AtomIcon>
)

MemoAtomIcon.displayName = 'AtomIcon'

export default MemoAtomIcon
`
}

export default template
