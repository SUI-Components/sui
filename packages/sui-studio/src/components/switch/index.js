import {forwardRef} from 'react'
import PropTypes from 'prop-types'
import * as SwitchPrimitives from '@radix-ui/react-switch'

const Switch = forwardRef(({className, checked, ...props}, ref) => {
  return (
    <span>
      <SwitchPrimitives.Root id="theme-mode" className="studio-switch" checked={checked} {...props} ref={ref}>
        <SwitchPrimitives.Thumb className="studio-switch-thumb" />
      </SwitchPrimitives.Root>
      <label htmlFor="theme-mode" style={{display: 'none'}}>
        switch color theme
      </label>
    </span>
  )
})

Switch.propTypes = {
  className: PropTypes.string,
  checked: PropTypes.bool
}

export default Switch
