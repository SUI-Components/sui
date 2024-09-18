export const userScreenInfo = ({payload, next}) => {
  payload.obj.context = {
    ...payload.obj.context,
    screen: {
      height: window.innerHeight,
      width: window.innerWidth,
      density: window.devicePixelRatio
    }
  }
  next(payload)
}
