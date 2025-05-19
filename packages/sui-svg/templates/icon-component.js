const template = content => {
  return `import {memo} from 'react'
import AtomIcon from '@s-ui/react-atom-icon'

const injectAccessibility = ({id, svg, title}) => {
  if (!title || !id) return svg.replace(/<svg([^>]*)>/, '<svg$1 aria-hidden="true">')

  return svg.replace(
    /<svg([^>]*)>/,
    \`<svg$1 role="img" aria-labelledby="\${id}"><title id="\${id}">\${title}</title>\`
  )
}

const MemoAtomIcon = memo(({id, title, ...props}) => {
  const safeContent = injectAccessibility({id, svg: \`${content}\`, title})

  return (
    <AtomIcon {...props}>
      <span dangerouslySetInnerHTML={{__html: safeContent}} />
    </AtomIcon>
  )
})

MemoAtomIcon.displayName = 'AtomIcon'

export default MemoAtomIcon
`
}

export default template
