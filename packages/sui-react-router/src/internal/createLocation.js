import {createLocation as createLocationFromHistory} from 'history'
import parseLocationSearch from './parseLocationSearch'

export default function createLocation(locationAsString, locationState) {
  const location = createLocationFromHistory(locationAsString, locationState)
  location.query = parseLocationSearch(location)
  return location
}
