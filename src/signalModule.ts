import type { ConText, Hook } from './init'
import type { VNode } from './vnode'
import type { Patch } from './init'
import { createVNode, isV, isVNode } from './vnode'
import { isDef, isUndef, isPrimitive, isFunction, isArray, isEmpty } from './utils'

export const signalModule = ({ api, _signal, _actions }: ConText, hook: Hook) => {
  const dirtyNodeList = new WeakSet<Node>() // 脏节点列表

  const _track = (el: Node, key: string, fn: () => void) => {
    let effects = api.getProperty(el, 'effects')
    if (isUndef(effects)) {
      api.setProperty(el, 'effects', (effects = new Map()))
      dirtyNodeList.add(el)
    }
    effects.set(key, _signal.effect(fn))
    return el
  }

  const _untrack = (el: Node, key?: string) => {
    const effects = api.getProperty(el, 'effects')
    if (isDef(effects) && dirtyNodeList.has(el)) {
      if (isUndef(key)) {
        dirtyNodeList.delete(el)
        effects.forEach((r: any) => _signal.stop(r))
        effects.clear()
      } else if (effects.has(key)) {
        _signal.stop(effects.get(key))
        effects.delete(key)
      }
    }
  }

  hook.add('transform', (data: any): any => {
    if (_signal.is(data) && isPrimitive(_signal.get(data))) return createVNode('Text', data)
    else if (isFunction(data)) {
      const rv = data()
      if (isVNode(rv) || isArray(rv)) return createVNode('Fragment', { dynamic: data })
    }
    return void 0
  })

  hook.add('patch', (key: string, val: any, reference: any[]) => {
    if (_signal.is(val)) {
      reference.push([key, val])
      return true
    }
    return void 0
  })

  hook.add(
    'identify',
    (
      vnode: VNode,
      parent: Patch,
      patchs: Map<string, Patch>,
      compile: (that: Patch, patchs?: Map<string, Patch>) => Map<string, Patch>,
      only: boolean
    ) => {
      if (isV('Text', vnode) && _signal.is(vnode.children![0])) {
        const signalText = vnode.children![0]
        vnode.children = void 0

        const id = '__RID_' + patchs.size
        compile({ vnode, id, parent, signalText, only }, patchs)
        parent.html! += `<!--${id}-->`
        return createVNode('Comment', id)
      } else if (isV('Fragment', vnode) && vnode.dynamic) {
        const id = '__RID_' + patchs.size
        compile({ vnode, id, parent, dynamic: vnode.dynamic, only }, patchs)
        parent.html! += `<!--__DYNAMIC_START${id}--><!--${id}--><!--__DYNAMIC_END${id}-->`
        return createVNode('Comment', id)
      }
      return void 0
    }
  )

  hook.add(
    'create',
    (that: Patch, _: any, compile: (that: Patch, patchs?: Map<string, Patch>) => Map<string, Patch>) => {
      const { vnode, signalText, dynamic } = that
      if (isV('Text', vnode) && _signal.is(signalText)) {
        that.elm = api.Text(_signal.get(signalText))
        _track(that.elm, 'signalText', () => api.setTextContent(that.elm!, _signal.get(signalText)))

        return true
      } else if (isV('Fragment', vnode) && dynamic) {
        const vnode = createVNode('Fragment', { children: [dynamic()].flat() })
        const _that: Patch = { vnode, root: true }
        compile(_that)
        that.elm = _that.elm

        return true
      }

      return void 0
    }
  )

  hook.add(
    'replace',
    (
      point: Comment,
      pid: string,
      _: Patch,
      patchs: Map<string, Patch>,
      compile: (that: Patch, patchs?: Map<string, Patch>) => Map<string, Patch>
    ) => {
      if (pid.startsWith('__DYNAMIC_START')) {
        const id = pid.slice(15)
        const child = patchs.get(id)
        child!.start = point
      } else if (pid.startsWith('__DYNAMIC_END')) {
        const id = pid.slice(13)
        const child = patchs.get(id)
        child!.end = point
        const { start, end, dynamic } = child!

        const source = _signal.memo(dynamic)

        _track(end, 'dynamic', () => {
          const parent = api.parentNode(end)!
          const node = _signal.get(source)
          const children = isEmpty(node) ? void 0 : [node].flat()
          const exist = children && children.length > 0

          let next: Node
          while ((next = api.nextSibling(start)!) !== end) api.removeChild(parent, next)

          if (exist) {
            const vnode = createVNode('Fragment', { children })
            const _that: Patch = { vnode, root: true }
            compile(_that)
            api.insertBefore(parent!, _that.elm!, end)
          }
        })
      }
      return void 0
    }
  )

  const baseKeys = ['style', 'class', 'on', 'data']
  baseKeys.forEach(key => {
    _actions.add(key, (elm: Element, name: string, data: any) => {
      if (_signal.is(data)) {
        const baseAction = _actions.get(key)[0]
        const set = () => baseAction(elm, name, _signal.get(data))
        set()
        _track(elm, key + ':' + name, set)
        return true
      }

      return void 0
    })
  })

  hook.add('reference', (key: string, val: any, elm: Element) => {
    if (_signal.is(val)) {
      const set = () => api.setAttribute(elm, key, _signal.get(val))
      set()
      _track(elm, key, set)
      return true
    }
    return void 0
  })

  return { _track, _untrack }
}
