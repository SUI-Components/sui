import PropTypes from 'prop-types'
import {useLocation} from '@s-ui/react-router'
import Tabs from './Tabs'
import Tab from './Tab'

const ThemesButtons = ({themes, onThemeChange}) => {
  const {
    query: {actualStyle = 'default'}
  } = useLocation()

  if (!themes.length) {
    return null
  }

  return (
    <Tabs title="Theme">
      {['default', ...themes].map((theme, index) => (
        <Tab
          handleClick={() => onThemeChange(theme)}
          key={`${theme}${index}`}
          isActive={theme === actualStyle}
          literal={theme}
        />
      ))}
    </Tabs>
  )
}

ThemesButtons.propTypes = {
  themes: PropTypes.array,
  onThemeChange: PropTypes.func
}

export default ThemesButtons
