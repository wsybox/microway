import type { Hook } from './init'
import { isUndef, isArray, isPlainObject, isBoolean, isFunction, isString, isPrimitive } from './utils'

export const baseModule = (_: any, hook: Hook) => {
  const actions: any = {
      class: [
        (elm: Element, key: string, val: any) => {
          if (isBoolean(val)) {
            elm.classList[val ? 'add' : 'remove'](key)
            return true
          }
          return void 0
        }
      ],
      style: [
        (elm: Element, key: string, val: any) => {
          if (isString(val)) {
            ;(elm as any).style[key] = val
            return true
          }
          return void 0
        }
      ],
      on: [
        (elm: Element, key: string, val: any) => {
          if (isFunction(val)) {
            elm.addEventListener(key, val)
            return true
          }
          return void 0
        }
      ],
      data: [
        (elm: Element, key: string, val: any) => {
          if (isPrimitive(val) || isBoolean(val) || val === null) {
            ;(elm as HTMLElement).dataset[key] = val + ''
            return true
          }
          return void 0
        }
      ]
    },
    _actions = {
      get: (key: string) => actions[key] || (actions[key] = []),
      add: (key: string, fn: () => boolean | undefined) => {
        if (isUndef(actions[key])) actions[key] = [fn]
        else actions[key]!.push(fn)
      }
    }

  const _aKeys = Object.keys(actions)

  hook.add('reference', (key: string, val: any, elm: Element) => {
    if (isArray(val) && key === 'class') {
      val.forEach(name => {
        if (isString(name)) elm.classList.add(name)
      })
      return true
    } else if (isFunction(val) && key.startsWith('on')) {
      const action = actions.on[0]
      action(elm, key.slice(2), val)
      return true
    } else if (isPlainObject(val) && _aKeys.includes(key)) {
      Object.entries(val).forEach(([name, data]) => {
        let cb
        for (cb of actions[key]) if (cb(elm, name, data)) break
      })

      return true
    }

    return void 0
  })

  return { _actions }
}
