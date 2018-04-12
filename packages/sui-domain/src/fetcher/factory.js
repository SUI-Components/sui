import AxiosFetcher from './AxiosFetcher'

export default class FetcherFactory {
  static httpFetcher = ({config}) => new AxiosFetcher({config})
}
