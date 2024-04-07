import { getKebabCase, genhook } from '.'
type Call = <T extends any>(...args: any[]) => T
type Use = (p: (h: typeof hook, ctx: any) => void) => { use: Use }

type VData = {
  tag: string
  strs?: TemplateStringsArray
  vals?: any[]
  children?: any[]
}

export class Way extends Function {
  private _call: Call
  setCall(call: Call) {
    this._call = call
  }

  data: VData
  ns?: any
  constructor(data: VData, call: Call) {
    super()
    this._call = call
    this.data = data
    return new Proxy(this, {
      apply: (target, _, args) => target._call.apply(target, args)
    })
  }
}

const isTemp = (args: any[]): args is [strs: TemplateStringsArray, ...vals: any[]] =>
  Array.isArray(args[0]) &&
  args[0].every(s => typeof s === 'string') &&
  args[0].hasOwnProperty('raw') &&
  args.length === args[0].length

const ctx: any = {}
const cbs: any = {}
const hook = genhook<(way: Way) => any>(cbs)

const _use: { use: Use } = { use: p => (p(hook, ctx), _use) }
export const use = _use.use

const chCall = function (this: Way, ...children: any[]) {
  let { data: d, ns } = this
  let data = { ...d, children }

  if (cbs.to) {
    let _rv, cb
    for (cb of cbs.to) {
      _rv = cb({ data, ns })
      if (_rv) return _rv
    }
  }

  return { data, ns }
}

const handle = (ns?: any) => ({
  get: (_: any, _tag: string) => {
    let tag = getKebabCase(_tag)
    const way: any = new Way({ tag }, function (this: Way, ...args: any[]) {
      if (isTemp(args)) {
        let [strs, ...vals] = args
        return new Way({ strs, vals, tag }, chCall)
      }
      return chCall.apply(this, args)
    })

    if (ns) way.ns = ns
    if (cbs.from) {
      let cb
      for (cb of cbs.from) cb(way)
    }
    return way
  }
})
export const t = new Proxy((ns: any) => new Proxy(t, handle(ns)), handle())
