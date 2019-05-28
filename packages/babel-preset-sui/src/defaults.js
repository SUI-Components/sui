module.exports = {
  DEFAULT_BROWSER_TARGETS: {
    chrome: '41', // previous googlebot version
    ie: '11',
    safari: '8',
    firefox: '60', // esr
    ios: '8'
  },
  DEFAULT_SERVER_TARGETS: {
    node: '6.0.0'
  },
  SELECTIVE_LOOSE_REACT_HOOKS: [
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
}
