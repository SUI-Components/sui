import {pascalCase} from 'change-case'

const template = (content, design = 'filled', name) => {
  const componentName = `Memo${pascalCase(name)}AtomIcon`
  return `import {memo} from 'react'
import AtomIcon from '@s-ui/react-atom-icon'

const injectAccessibility = ({id, svg, title}) => {
  if (!title || !id) return svg.replace(/<svg([^>]*)>/, '<svg$1 aria-hidden="true" role="presentation">')

  return svg.replace(
    /<svg([^>]*)>/,
    \`<svg$1 role="img" aria-labelledby="\${id}"><title id="\${id}">\${title}</title>\`
  )
}

const ${componentName} = memo(({id, title, design='${design}', ...props}) => {
  const safeContent = injectAccessibility({id, svg: \`${content}\`, title})

  return (
    <AtomIcon design={design} {...props}>
      <span dangerouslySetInnerHTML={{__html: safeContent}} />
    </AtomIcon>
  )
})

${componentName}.displayName = '${componentName}'

export default ${componentName}
`
}

export default template
