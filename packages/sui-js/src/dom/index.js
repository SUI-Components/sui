const getCurrentElementFocused = () => document.activeElement

export const getFocusedItemIndex = domItems => {
  const currentElementFocused = getCurrentElementFocused()
  return domItems.reduce(
    (focusedItemIndex, item, index) =>
      item === currentElementFocused ? index : focusedItemIndex,
    null
  )
}
