import {createLocation as createLocationFromHistory} from 'history'
import parseLocationSearch from './parseLocationSearch'

export default function createLocation(locationAsString) {
  const location = createLocationFromHistory(locationAsString)
  location.query = parseLocationSearch(location)
  return location
}
