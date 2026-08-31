export type Action = 'PUSH' | 'REPLACE' | 'POP'

export type Query = object
export type QueryString = string
export type Pathname = string
export type Params = object

/**
 * A location key is a string that is unique to a particular location. It is the one piece of data that most accurately answers the question "Where am I?".
 */
export type LocationKey = string
export type Search = string
export type Path = string

interface LocationState {
  from?: Location
  shallow?: Boolean
}

export interface LocationDescriptorObject {
  pathname: Pathname
  search?: Search
  query?: Query
  state?: LocationState
}

export type LocationDescriptor = LocationDescriptorObject | Path

export interface Route {
  component?: RouteComponent
  getComponent?: () => Promise<RouteComponent>
  path?: RoutePattern
  regexp: RouteRegExp
}

export type Router = RouterState & {
  createHref: (location: LocationDescriptor, query?: string) => string
  go: (n: number) => void
  goBack: () => void
  goForward: () => void
  isActive: (location: LocationDescriptor, indexOnly: boolean) => boolean
  push: (location: LocationDescriptor) => void
  replace: (location: LocationDescriptor) => void
}

export interface RouteInfo {
  location: Location
  routes: Route[]
  params: Params
}

export type RouterState = RouteInfo & {
  components: React.ComponentType[]
}

export type RouteComponent = React.ComponentType

export type RoutePattern = string
export type RouteRegExp = RegExp

export interface Location {
  action: Action
  key: LocationKey
  pathname: Pathname
  query: Query
  search: QueryString
  state: LocationState
}
