import PropTypes from 'prop-types'
import React from 'react'
import Tabs from './Tabs'
import Tab from './Tab'

const executeUseCase = ({domain, useCase, params}) => {
  return domain.get(useCase).execute(params)
}

const EventsButtons = ({events, domain}) => {
  if (!domain || !events.length) return null

  return (
    <Tabs title="Events">
      {Object.keys(events).map(useCase =>
        Object.keys(events[useCase]).map(event => (
          <Tab
            handleClick={evt => {
              executeUseCase({
                domain,
                useCase,
                params: events[useCase][event]
              })
            }}
            key={`${useCase}#${event}`}
            literal={event}
          />
        ))
      )}
    </Tabs>
  )
}

EventsButtons.displayName = 'EventsButtons'
EventsButtons.propTypes = {
  domain: PropTypes.object,
  events: PropTypes.object
}

export default EventsButtons
