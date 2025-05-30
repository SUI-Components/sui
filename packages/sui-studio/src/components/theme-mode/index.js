import PropTypes from 'prop-types'
import {forwardRef} from 'react'
import {DarkModeSwitch} from 'react-toggle-dark-mode'

const COLORS = ['white', 'black']

const ThemeMode = forwardRef(({className, onChange, mode, size = 24, design, ...props}, ref) => {
  const colors = design === 'inverted' ? {light: COLORS[0], dark: COLORS[1]} : {light: COLORS[1], dark: COLORS[0]}
  return (
    <button className="theme-mode" aria-label={`set ${mode === 'light' ? 'dark' : 'light'} mode`} ref={ref}>
      <DarkModeSwitch
        className={className}
        onChange={onChange}
        checked={mode === 'dark'}
        size={size}
        sunColor={colors.light}
        moonColor={colors.dark}
        {...props}
      />
    </button>
  )
})

ThemeMode.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func,
  mode: PropTypes.oneOf(['light', 'dark']),
  size: PropTypes.number,
  design: PropTypes.oneOf(['inverted'])
}

export default ThemeMode
