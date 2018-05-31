const ui = (path, nextValue) => dispatch =>
  dispatch({
    type: 'UI',
    payload: {[path]: nextValue}
  })

const actions = () => ({ui})

export default actions
