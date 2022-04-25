export const suitClass =
  className =>
  ({children} = {}) =>
  ({element, modifier} = {}) => {
    if (children) className += `-${children}`
    if (element) className += `-${element}`
    if (modifier) className += `--${modifier}`
    return className
  }
