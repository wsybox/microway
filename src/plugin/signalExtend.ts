import { Way, render, compilerChildren, isDef, isUndef, isPrimitive, isFunction, isArray } from '../core'

export const signalExtendPlugin = ({ signal, parmAction, keywords, api }: any, hook: any) => {
  keywords.push('__effects__')
  const dirtyNodeList = new WeakSet<Node>() // 脏节点列表

  const track = (el: Node, key: string, fn: () => void) => {
    let effects = api.getProperty(el, '__effects__')
    if (isUndef(effects)) {
      api.setProperty(el, '__effects__', (effects = new Map()))
      dirtyNodeList.add(el)
    }
    effects.set(key, signal.effect(fn))
    return el
  }

  const untrack = (el: Node, key?: string) => {
    let effects = api.getProperty(el, '__effects__')
    if (isDef(effects) && dirtyNodeList.has(el)) {
      if (isUndef(key)) {
        dirtyNodeList.delete(el)
        effects.forEach((r: any) => signal.stop(r))
        effects.clear()
      } else if (effects.has(key)) {
        signal.stop(effects.get(key))
        effects.delete(key)
      }
    }
  }

  hook.compile((data: any) => {
    if (signal.is(data) && isPrimitive(signal.get(data))) {
      let dom = api.createTextNode(signal.get(data).toString())
      track(dom, 'signalText', () => api.setTextContent(dom, signal.get(data).toString()))
      return dom
    }
  })

  hook.compile((data: any) => {
    if (isFunction(data)) {
      const rv = data()
      let isarr = isArray(rv)
      if (rv instanceof Way || isarr) {
        let fgm = api.createDocumentFragment()
        let start = api.createComment(`__DYNAMIC_START__`)
        let end = api.createComment(`__DYNAMIC_END__`)
        if (isarr) {
          api.append(fgm, start)
          compilerChildren(fgm, rv)
          api.append(fgm, end)
        } else api.append(fgm, start, render(rv), end)
        const source = signal.memo(data)

        track(end, 'dynamic', () => {
          const parent = api.parentNode(end)
          const node = signal.get(source)

          let next: Node
          while ((next = api.nextSibling(start)) !== end) api.removeChild(parent, next)

          if (isArray(node) && node.length > 0) {
            let f = api.createDocumentFragment()
            compilerChildren(f, node)
            api.insertBefore(parent, f, end)
          } else if (node instanceof Way) api.insertBefore(parent, render(node), end)
        })

        return fgm
      }
    }
  })

  const baseKeys = ['style', 'class', 'on', 'data']
  baseKeys.forEach(key => {
    parmAction[key]((elm: Element, name: string, data: any) => {
      if (signal.is(data)) {
        const baseAction = parmAction[key].get(0)
        const set = () => baseAction(elm, name, signal.get(data))
        set()
        track(elm, key + ':' + name, set)
        return true
      }
    })
  })

  hook.param((elm: Element, key: string, val: any) => {
    if (signal.is(val) && isPrimitive(signal.get(val))) {
      const set = () => api.setAttribute(elm, key, signal.get(val))
      set()
      track(elm, key, set)
      return true
    }
    return void 0
  }, -1)

  return { track, untrack }
}
