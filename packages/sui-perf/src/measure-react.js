import ReactDebug from 'react-dom/lib/ReactDebugTool'
import ReactComponentTreeHook from 'react/lib/ReactComponentTreeHook'

class SuiPerfHook {
  constructor(perf) {
    this.perf = perf
  }

  isNativeComponent(debugID) {
    const label = ReactComponentTreeHook.getDisplayName(debugID) || 'unknown'
    return label[0].toLowerCase() === label[0]
  }

  getMarkName(debugID) {
    return (
      '<' + (ReactComponentTreeHook.getDisplayName(debugID) || 'Unknown') + '>'
    )
  }

  onBeforeMountComponent(debugID, element, parentDebugID) {
    !this.isNativeComponent(debugID) &&
      this.perf.mark(this.getMarkName(debugID))
  }

  onMountComponent(debugID, element, parentDebugID) {
    !this.isNativeComponent(debugID) &&
      this.perf.stop(this.getMarkName(debugID))
  }
}

const measureReact = perf => {
  let perfHook = new SuiPerfHook(perf)
  ReactDebug.addHook(perfHook)
  return ReactDebug.removeHook.bind(ReactDebug, perfHook)
}

export default measureReact
