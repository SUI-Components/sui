import {useState} from 'react'
import ReactDOM from 'react-dom'

import {ATOM_ICON_COLORS, ATOM_ICON_SIZES} from '@s-ui/react-atom-icon'
import {icons as iconFiles} from '@s-ui/svg-icons'

import './index.scss'

// eslint-disable-next-line react/prop-types
const Select = ({onChange, name, options, value}) => {
  const handleChange = e => onChange(e.target.value)
  return (
    <>
      <span>{name}:</span>
      <select name={name} onChange={handleChange} value={value}>
        {Object.keys(options).map(key => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </select>
    </>
  )
}

const cleanKey = key => {
  const [filename] = key.split('/').reverse()
  return filename.replace('.js', '')
}
const isEmptySearch = search => search === ''

const getIconsToShow = ({searchKey}) => {
  return Object.entries(iconFiles)
    .filter(([key]) => {
      if (isEmptySearch(searchKey)) return true

      const iconName = cleanKey(key)
      return iconName.toLowerCase().includes(searchKey.toLowerCase())
    })
    .map(([key, module]) => {
      const {default: Component} = module
      const name = cleanKey(key)
      return {Component, name}
    })
}

const App = () => {
  const [searchKey, setSearchKey] = useState('')
  const [size, setSize] = useState(ATOM_ICON_SIZES.medium)
  const [color, setColor] = useState(ATOM_ICON_COLORS.currentColor)

  const icons = getIconsToShow({searchKey})
  return (
    <>
      <header>
        <div>
          <input
            autoFocus
            onChange={e => setSearchKey(e.target.value)}
            type="search"
            placeholder="Search your icon..."
          />
        </div>
        <div>
          <Select
            name="size"
            onChange={setSize}
            options={ATOM_ICON_SIZES}
            value={size}
          />
          <Select
            name="color"
            onChange={setColor}
            options={ATOM_ICON_COLORS}
            value={color}
          />
        </div>
      </header>
      <section>
        {icons.map(({Component, name}) => {
          return (
            <i key={name} data-tooltip={name}>
              <Component color={color} size={ATOM_ICON_SIZES[size]} />
            </i>
          )
        })}
      </section>
    </>
  )
}

ReactDOM.render(<App />, document.getElementById('app'))
