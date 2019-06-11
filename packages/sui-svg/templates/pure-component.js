const template = (code, config, state) => {
  return `import React, {memo, useEffect, useState} from 'react'
import PropTypes from 'prop-types'

const  ${state.componentName} = ({ssr = false, className}) => {
  const [render, setRender] = useState(ssr)

  useEffect(function() {
    if (render === false) {
      setRender(true)
    }
  }, [])

  return render === false
    ? null
    : ${code.replace('svg', 'svg className={className}')}
}

${state.componentName}.propTypes = {
  ssr: PropTypes.bool
}

export default memo(${state.componentName})
`
}

module.exports = template
