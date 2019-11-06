/* global __BASE_DIR__ */

import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {render} from 'react-dom'
import {ATOM_ICON_COLORS, ATOM_ICON_SIZES} from '@s-ui/react-atom-icon'
import './index.scss'

const ctx = require.context(`${__BASE_DIR__}/lib`, true, /\.*\.js$/)

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

Select.propTypes = {
  name: PropTypes.string,
  onChange: PropTypes.func,
  options: PropTypes.array,
  value: PropTypes.string
}

const cleanKey = key => key.replace('./', '').replace('.js', '')

const App = () => {
  const [size, setSize] = useState(ATOM_ICON_SIZES.medium)
  const [color, setColor] = useState(ATOM_ICON_COLORS.currentColor)

  return (
    <>
      <header>
        <strong>Iconset</strong>
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
      </header>
      <section>
        {ctx.keys().map((key, idx) => {
          const {default: Icon} = ctx(key)
          return (
            <i key={key} data-tooltip={cleanKey(key)}>
              <Icon size={ATOM_ICON_SIZES[size]} color={color} />
            </i>
          )
        })}
      </section>
    </>
  )
}

render(<App />, document.getElementById('app'))
