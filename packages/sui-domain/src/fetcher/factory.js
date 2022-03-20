import AxiosFetcher from './AxiosFetcher.js'

export default class FetcherFactory {
  static httpFetcher = ({config}) => new AxiosFetcher({config})
}
