/** @typedef {import('./FetcherInterface').default} FetcherInterface */
/** @extends {FetcherInterface} */
export default interface InterceptableFetcherInterface {
  setErrorInterceptor: (callback: () => void) => void
  unsetErrorInterceptor: () => void
}
