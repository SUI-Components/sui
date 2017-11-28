import AxiosFetcher from './AxiosFetcher'

export default class FetcherFactory {
  static axiosFetcher = ({config}) =>
    new AxiosFetcher({config})
}
