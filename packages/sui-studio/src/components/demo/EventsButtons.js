/* global __BASE_DIR__ */
import React, {PropTypes} from 'react'
import Tabs from './Tabs'
import Tab from './Tab'

const reqFixturesDemo =
  require.context(`${__BASE_DIR__}`, true, /\/demo\/fixtures\/.*\.js/)

const executeUseCase = ({domain, useCase, params}) => {
  const base = reqFixturesDemo(`./demo/fixtures/${useCase}.js`).default
  domain.get(useCase).execute({
    ...base,
    ...params
  })
}

const EventsButtons = ({events, domain}) => {
  if (!domain) { return null }

  return (
    <Tabs title='Events'>
      {
          Object.keys(events).map(
            useCase => Object.keys(events[useCase]).map(
              event => (
                <Tab
                  handleClick={evt => {
                    executeUseCase({domain, useCase, params: events[useCase][event]})
                  }}
                  key={`${useCase}#${event}`}
                  literal={event}
                />
              )
            )
          )
      }
    </Tabs>
  )
}

EventsButtons.displayName = 'EventsButtons'
EventsButtons.propTypes = {
  domain: PropTypes.object,
  events: PropTypes.object
}

export default EventsButtons
