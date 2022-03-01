export const execute = error => {
  try {
    if (error) {
      throw new Error(error)
    }
    return `This is a template string`
  } catch (e) {}
}
