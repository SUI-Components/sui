const DEFAULT_LENGTH = 15

export const getRandomString = (length = DEFAULT_LENGTH) =>
  [...Array(length)]
    .fill()
    .map(() => ((Math.random() * 36) | 0).toString(36))
    .join('')
