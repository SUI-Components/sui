export default interface FetcherInterface {
  get(url: string, options: object): Promise<any>,
  post(url: string, body: string, options: object): Promise<any>,
  put(url: string, body: string, options: object): Promise<any>,
  patch(url: string, body: string, options: object): Promise<any>,
  delete(url: string, options: object): Promise<any>
}
