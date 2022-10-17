const pipe =
  (...funcs) =>
  arg =>
    funcs.reduce((acc, value) => value(acc), arg)
export default pipe

export const asyncPipe =
  (...funcs) =>
  arg =>
    funcs.reduce((acc, value) => acc.then(value), Promise.resolve(arg))
