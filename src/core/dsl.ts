import { getKebabCase, genhook } from '.'

type VData = {
  tag: string
  strs?: TemplateStringsArray
  vals?: any[]
  children?: any[]
}

export class Way extends Function {
  private _call: <T extends any>(...args: any[]) => T
  setCall(call: <T extends any>(...args: any[]) => T) {
    this._call = call
  }

  data: VData
  ns?: string
  constructor(data: VData, call: <T extends any>(...args: any[]) => T) {
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
const cbs: {
  to?: ((way: { data: VData; ns?: string }) => any)[]
  from?: ((way: { data: VData; ns?: string }) => any)[]
} = {}
const hook = genhook<(way: Way) => any>(cbs)

export const use = (p: (h: typeof hook, ctx: any) => void) => p(hook, ctx)

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

const handle = (ns?: string) => ({
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

export const t = new Proxy((ns: string) => new Proxy(t, handle(ns)), handle())
