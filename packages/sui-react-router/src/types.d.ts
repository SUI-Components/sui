export type Action = 'PUSH' | 'REPLACE' | 'POP';

/**
 * A location key is a string that is unique to a particular location. It is the one piece of data that most accurately answers the question "Where am I?".
 */
export type LocationKey = string

export type LocationDescriptorObject = {
  pathname: Pathname;
  search?: Search;
  query?: Query;
  state?: LocationState;
};

export type LocationDescriptor = LocationDescriptorObject | Path;

export type Query = Object

export type QueryString = string

export type Pathname = string

export type Params = Object

export type Route = {
  component?: RouteComponent
  getComponent?: () => Promise<RouteComponent>
  path?: RoutePattern
  regexp: RouteRegExp
}

export type Router = RouterState & {
  go: (n: number) => void
  goBack: () => void
  goForward: () => void
  isActive: (location: LocationDescriptor, indexOnly: boolean) => Boolean
  push: (location: LocationDescriptor) => void
  replace: (location: LocationDescriptor) => void
}

export type RouteInfo = {
  location: Location
  routes: Array<Route>
  params: Params
}

export type RouterState = RouteInfo & {
  components: Array<Component>
}

export type RouteComponent = Component

export type RoutePattern = string
export type RouteRegExp = RegExp

export type Location = {
  action: Action
  key: LocationKey
  pathname: Pathname
  query: Query
  search: QueryString
  state: LocationState
}
