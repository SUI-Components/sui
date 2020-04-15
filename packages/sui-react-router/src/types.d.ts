export type Action = 'PUSH' | 'REPLACE' | 'POP';

type LocationDescriptorObject = {
  pathname: Pathname;
  search?: Search;
  query?: Query;
  state?: LocationState;
};

type LocationDescriptor = LocationDescriptorObject | Path;

/**
 * A location key is a string that is unique to a particular location. It is the one piece of data that most accurately answers the question "Where am I?".
 */
type LocationKey = string

type Query = Object

type QueryString = string

type Pathname = string

type Route = {
  getComponent?: () => Promise<RouteComponent>
  component?: RouteComponent
  path?: RoutePattern
}

type Router = RouterState & {
  push: (location: LocationDescriptor) => void
  replace: (location: LocationDescriptor) => void
  go: (n: number) => void
  goBack: () => void
  goForward: () => void
  isActive: (location: LocationDescriptor, indexOnly: boolean) => Boolean
}

type RouterState = {
  location: Location
  routes: Array<Route>
  params: Params
  components: Array<Component>
}

type RouteComponent = Component

type RoutePattern = string

export type Location = {
  pathname: Pathname
  search: QueryString
  query: Query
  state: LocationState
  action: Action
  key: LocationKey
}