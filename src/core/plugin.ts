import { api, isBoolean, isPrimitive, isArray, isString, isFunction, isPlainObject, isUndef, isDef, genhook } from '.'

type Obj = { [key in string]: any }
type Use = (p: Obj | ((ctx: Obj, h: typeof hook) => Obj)) => { use: Use }
type CB = (elm: Element, key: string, val: any) => boolean | undefined

const pcbs: {
  class?: CB[]
  style?: CB[]
  on?: CB[]
  data?: CB[]
} = {}

export const ctx: Obj = {
  parmAction: genhook<(elm: Element, key: string, val: any) => boolean | undefined>(pcbs),
  keywords: [],
  api
}

pcbs.class = [
  (elm: Element, key: string, val: any) => {
    if (isBoolean(val)) {
      ctx.api.classList(elm)[val ? 'add' : 'remove'](key)
      return true
    }
  }
]
pcbs.style = [
  (elm: Element, key: string, val: any) => {
    if (isString(val)) {
      ctx.api.getProperty(elm, 'style')[key] = val
      return true
    }
  }
]
pcbs.on = [
  (elm: Element, key: string, val: any) => {
    if (isFunction(val)) {
      ctx.api.addEventListener(elm, key, val)
      return true
    }
  }
]
pcbs.data = [
  (elm: Element, key: string, val: any) => {
    if (isPrimitive(val) || isBoolean(val) || val === null) {
      ctx.api.getProperty(elm, 'dataset')[key] = val + ''
      return true
    }
  }
]

const pKeys = Object.keys(pcbs)

export const cbs: Obj = {
  param: [
    (elm: Element, key: keyof typeof pcbs, val: any) => {
      if (isArray(val) && key === 'class') {
        val.forEach(name => {
          if (isString(name)) ctx.api.classList(elm).add(name)
        })
        return true
      } else if (isFunction(val) && key.startsWith('on')) {
        pcbs.on![0](elm, key.slice(2), val)
        return true
      } else if (isPlainObject(val) && pKeys.includes(key)) {
        Object.entries(val).forEach(([name, data]) => {
          let cb
          for (cb of pcbs[key]!) if (cb(elm, name, data)) break
        })

        return true
      }

      return void 0
    }
  ]
}

const hook = genhook(cbs)

const _use: { use: Use } = {
  use: p => {
    const _ctx = isFunction(p) ? p(ctx, hook) : p
    if (isDef(_ctx)) {
      let key
      for (key in _ctx) {
        if (key === 'api' && ctx.api === api) ctx.api = _ctx.api
        else if (isUndef(ctx[key])) ctx[key] = _ctx[key]
      }
    }
    return _use
  }
}
export const use = _use.use
