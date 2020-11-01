import parseLocationSearch from './parseLocationSearch'

export default function useHistoryLocationQuery(history) {
  const getCurrentLocation = () => ({
    ...history.location,
    query: parseLocationSearch(history.location)
  })

  return {
    ...history,
    getCurrentLocation,
    get location() {
      return getCurrentLocation()
    },
    listen: listener =>
      history.listen(location =>
        listener({
          ...location,
          query: parseLocationSearch(location)
        })
      )
  }
}
