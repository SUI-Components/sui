import PropTypes from 'prop-types'

import Tab from './Tab'
import Tabs from './Tabs'

const ThemesButtons = ({themes, onThemeChange, selected}) => {
  if (!themes.length) return null

  return (
    <Tabs title="Theme">
      {['default', ...themes].map((theme, index) => (
        <Tab
          handleClick={() => onThemeChange(theme, index)}
          key={`${theme}${index}`}
          isActive={index === selected}
          literal={theme}
        />
      ))}
    </Tabs>
  )
}

ThemesButtons.propTypes = {
  themes: PropTypes.array,
  onThemeChange: PropTypes.func,
  selected: PropTypes.number
}

export default ThemesButtons
