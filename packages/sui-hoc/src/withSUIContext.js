import SUIContext from '@s-ui/react-context'

export default context => Target => props =>
  (
    <SUIContext.Provider value={context}>
      <Target {...props} />
    </SUIContext.Provider>
  )
