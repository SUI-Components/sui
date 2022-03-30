export default interface FetcherInterface {
  delete: (url: string, options: object) => Promise<any>
  get: (url: string, options: object) => Promise<any>
  patch: (url: string, body: string, options: object) => Promise<any>
  post: (url: string, body: string, options: object) => Promise<any>
  put: (url: string, body: string, options: object) => Promise<any>
  setErrorInterceptor: (callback: Function) => void
  setResponseInterceptor: (callback: Function) => void
}
