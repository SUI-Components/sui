export const DEFAULT_LEGACY_TARGETS = {
  chrome: '41',
  ie: '11',
  safari: '8',
  firefox: 'esr',
  ios: '8'
}

export const DEFAULT_MODERN_TARGETS = {
  esmodules: true
}

export const DEFAULT_SERVER_TARGETS = {
  node: '6.0.0'
}

export const SELECTIVE_LOOSE_REACT_HOOKS = [
  'useState',
  'useEffect',
  'useContext',
  'useReducer',
  'useCallback',
  'useMemo',
  'useRef',
  'useImperativeHandle',
  'useLayoutEffect',
  'useDebugValue'
]
