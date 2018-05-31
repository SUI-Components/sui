import PropTypes from 'prop-types'
import React from 'react'
import Tabs from './Tabs'
import Tab from './Tab'

const executeUseCase = ({domain, useCase, params}) => {
  return domain.get(useCase).execute(params)
}

const dispatchEvent = ({store, domain, useCase, params}) => {
  executeUseCase({domain, useCase, params}).then(result => {
    store.dispatch({
      type: useCase,
      payload: {params, result}
    })
  })
}

const EventsButtons = ({events, store, domain}) => {
  if (!store && !domain) {
    return null
  }

  return (
    <Tabs title="Events">
      {Object.keys(events).map(useCase =>
        Object.keys(events[useCase]).map(event => (
          <Tab
            handleClick={evt => {
              store
                ? dispatchEvent({
                    store,
                    domain,
                    useCase,
                    params: events[useCase][event]
                  })
                : executeUseCase({
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
  store: PropTypes.object,
  domain: PropTypes.object,
  events: PropTypes.object
}

export default EventsButtons
