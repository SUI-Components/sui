const pipe = (...funcs) => arg => funcs.reduce((acc, value) => value(acc), arg)

export default pipe
