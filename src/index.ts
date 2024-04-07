import { init, render } from './core'
init(h => h.to(render))

export { t, use } from './core'
export { signalExtendPlugin } from './plugin/signalExtend'
export { define, definePlugin } from './plugin/define'
