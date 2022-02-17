export const describeOnLocal = fn => {
  if (process.env.CI) return
  return fn()
}
