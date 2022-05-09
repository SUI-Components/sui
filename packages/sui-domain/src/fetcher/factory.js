import AxiosFetcher from './AxiosFetcher.js'
import FetcherInterceptor from './FetcherInterceptor.js'

export default class FetcherFactory {
  static interceptableHttpFetcher = ({config}) =>
    new FetcherInterceptor({
      fetcher: new AxiosFetcher({config})
    })

  static httpFetcher = ({config}) => new AxiosFetcher({config})
}
