import PropTypes from 'prop-types'
import {forwardRef} from 'react'
import {DarkModeSwitch} from 'react-toggle-dark-mode'

const ThemeMode = forwardRef(({className, onChange, mode, ...props}, ref) => {
  return (
    <button className="theme-mode" aria-label={`set ${mode === 'light' ? 'dark' : 'light'} mode`} ref={ref}>
      <DarkModeSwitch onChange={onChange} checked={mode === 'dark'} size={24} />
    </button>
  )
})

ThemeMode.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func,
  mode: PropTypes.oneOf(['light', 'dark'])
}

export default ThemeMode
