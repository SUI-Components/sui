import { connect } from 'react-redux'

const mapUIResponseToProps = (...paths) => Target => {
  const Enhance = connect(state => {
    return paths.reduce((props, path) => {
      props[`${path}UI`] = state.ui[path]
      return props
    }, {})
  })(Target)

  Enhance.originalContextTypes = Target.originalContextTypes || Target.contextTypes
  Enhance.displayName = `mapUIResponseToProps(${Target.displayName})`
  Enhance.getInitialProps = Target.getInitialProps
  return Enhance
}

export default mapUIResponseToProps
