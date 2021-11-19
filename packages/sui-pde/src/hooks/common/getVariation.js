export const serverGetVariation = ({pde, experimentName, attributes}) => {
  return pde.getVariation({pde, name: experimentName, attributes})
}

export const clientGetVariation = ({pde, experimentName, attributes}) => {
  const variationName = pde.activateExperiment({
    name: experimentName,
    attributes
  })

  return variationName
}
