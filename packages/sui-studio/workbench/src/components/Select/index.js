import React, {useState} from 'react'
import PropTypes from 'prop-types'

export default function Select({initValue, label, onChange, options}) {
  const [value, setValue] = useState(initValue)

  if (!Object.keys(options).length) return null

  const handleChangeSelect = event => {
    const {value} = event.target
    setValue(value)
    onChange(value)
  }

  return (
    <label className="Select">
      <span>{label}</span>
      <select value={value} onChange={handleChangeSelect}>
        {Object.keys(options).map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

Select.propTypes = {
  initValue: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.object.isRequired
}
