export const getCurrentElementFocused = () => document.activeElement

export const getFocusedItemIndex = items => {
  const currentElementFocused = getCurrentElementFocused()
  const index = Array.from(items).findIndex(item => item === currentElementFocused)
  return index === -1 ? null : index
}
