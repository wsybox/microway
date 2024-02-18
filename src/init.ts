import type { VNode } from './vnode'
import { createVNode, isVNode, isV } from './vnode'
import type { DOMAPI } from './htmldomapi'
import { htmlDomApi } from './htmldomapi'
import {
  compilerToVNode,
  isUndef,
  isDef,
  isPlainObject,
  isPrimitive,
  typeTag,
  isFunction,
  isArray,
  isBoolean
} from './utils'

type ParentElement = Element | DocumentFragment
type LegalElement = ParentElement | Text | Comment

export type Patch = {
  root?: boolean
  parent?: Patch
  only?: boolean
  id?: string
  html?: string
  vnode: VNode
  elm?: LegalElement
  reference?: any[]
} & Obj

type BaseConText = { api: DOMAPI }
type Obj = { [key in string]: any }
export type ConText = BaseConText & Obj

type LifeCycleHooks = {
  transform: (obj: any) => VNode | undefined
  identify: (
    vnode: VNode,
    parent: Patch,
    patchs: Map<string, Patch>,
    compile: (that: Patch, patchs?: Map<string, Patch>) => Map<string, Patch>,
    only: boolean
  ) => VNode | undefined
  patch: (key: string, val: any, reference: any[]) => boolean | undefined
  create: (
    that: Patch,
    template: (html: string) => DocumentFragment | Element | undefined,
    compile: (that: Patch, patchs?: Map<string, Patch>) => Map<string, Patch>
  ) => boolean | undefined
  replace: (
    point: Comment,
    pid: string,
    that: Patch,
    patchs: Map<string, Patch>,
    compile: (that: Patch, patchs?: Map<string, Patch>) => Map<string, Patch>
  ) => boolean | undefined
  reference: (key: string, val: any, elm: Element) => boolean | undefined
}
type HookName = keyof LifeCycleHooks
type LifeCycle = { [T in HookName]?: Array<LifeCycleHooks[T]> }
export type Hook = {
  get: <T extends HookName>(name: T) => Array<LifeCycleHooks[T]>
  add: <T extends HookName>(name: T, fns: any) => void
}

type Module = Obj | (<T extends Obj>(ctx: Obj, hook: Hook) => T)

const hooks = ['transform', 'identify', 'patch', 'create', 'replace', 'reference']
export const isHookName = (name: string): name is HookName => hooks.includes(name)

export const l = (strs: TemplateStringsArray, ...vals: any[]) => {
  const rv = {
    [Symbol.toStringTag]: 'LTag',
    strs,
    vals
  }

  return Object.assign((...children: any[]) => ({ ...rv, children }), rv)
}

export const init = (...modules: Module[]) => {
  const ctx: ConText = { api: htmlDomApi },
    _ctx: Obj = {},
    cbs: LifeCycle = {},
    hook: Hook = {
      get: name => cbs[name] || (cbs[name] = []),
      add: (name, fn) => {
        if (isHookName(name)) {
          if (isUndef(cbs[name])) cbs[name] = [fn]
          else cbs[name]!.push(fn)
        }
      }
    }

  let module: Obj, key
  for (module of modules) {
    if (typeof module === 'function') module = module({ ...ctx, ..._ctx }, hook)
    if (isDef(module) && isPlainObject(module))
      for (key in module) {
        if (key.startsWith('_')) {
          if (isUndef(_ctx[key])) _ctx[key] = module[key]
        } else {
          if (key === 'api' && ctx.api === htmlDomApi) ctx.api = module.api
          else if (isUndef(ctx[key])) ctx[key] = module[key]
        }
      }
  }

  const { api } = ctx

  const transform = (obj: any): VNode | undefined => {
    if (isVNode(obj)) return obj
    else if (isPrimitive(obj)) return createVNode('Text', obj)
    else if (typeTag(obj) === '[object LTag]') {
      const { strs, vals, children } = obj
      const { data, tag, tpl } = compilerToVNode(strs, vals)
      const isSVG = api.SVGElements.has(tag)
      return createVNode('Element', { data, tag, tpl, isSVG, children })
    } else if (cbs.transform) {
      let __vnode, cb
      for (cb of cbs.transform) {
        __vnode = cb(obj)
        if (__vnode) return __vnode
      }
    }

    return void 0
  }

  const circulate = (vnode: VNode, call?: (vnode: VNode, only: boolean) => VNode) => {
    const { children: ch } = vnode
    if (['Element', 'Fragment'].includes(vnode.type) && ch && ch.length > 0) {
      let i, item
      for (i = 0; i < ch.length; i++) {
        item = transform(ch[i])
        if (item && call) item = call(item, ch.length === 1)
        ch.splice(i, 1, item)
        item = void 0
      }
    }
  }

  const nodesCache = new Map<string, NodeListOf<ChildNode>>()
  const template = (html: string) => {
    let nodes = nodesCache.get(html)
    if (!nodes) {
      const t = api.Element('template')
      t.innerHTML = html
      nodesCache.set(html, (nodes = t.content.childNodes))
    }

    if (nodes.length > 1) {
      const f = api.Fragment()
      nodes.forEach(item => f.append(api.cloneNode(item, true)))
      return f as DocumentFragment
    } else if (nodes.length === 1) return api.cloneNode(nodes[0], true) as Element
    else return void 0
  }

  const patch = (that: Patch, patchs: Map<string, Patch>) => {
    if (that.root && isV('Fragment', that.vnode)) that.html = ''
    else if (isV('Element', that.vnode)) that.html = `<${that.vnode.tpl}>`
    const call = (vnode: VNode, only: boolean) => {
      const reference: any[] = []
      if (isV('Element', vnode)) {
        const { data } = vnode
        if (data && data.length > 0) {
          data.forEach(obj => {
            let key
            _obj: for (key in obj) {
              if (cbs.patch) {
                let cb
                for (cb of cbs.patch) if (cb(key, obj[key], reference)) continue _obj
              }
              if (isPrimitive(obj[key])) {
                vnode.tpl += `${key}='${obj[key]}' `
              } else if (isFunction(obj[key]) || isPlainObject(obj[key]) || isArray(obj[key])) {
                reference.push([key, obj[key]])
              }
            }
          })
        }

        if (reference.length > 0) {
          const id = '__RID_' + patchs.size
          compile({ vnode, id, reference, parent: that, only }, patchs)
          that.html! += `<!--${id}-->`
          return createVNode('Comment', id)
        } else that.html += `<${vnode.tpl}>`
      } else if (isV('Text', vnode) && isPrimitive(vnode.children![0]))
        that.html! += vnode.children![0]
      else if (cbs.identify) {
        let __vnode, cb
        for (cb of cbs.identify) {
          __vnode = cb(vnode, that, patchs, compile, only)
          if (__vnode) return __vnode
        }
      }
      circulate(vnode, call)
      if (isV('Element', vnode) && reference.length === 0) that.html += `</${vnode.tag}>`
      return vnode
    }
    circulate(that.vnode, call)
    if (isV('Element', that.vnode)) that.html += `</${that.vnode.tag}>`
  }

  const replace = (that: Patch, patchs: Map<string, Patch>) => {
    const iter = document.createNodeIterator(that.elm!, NodeFilter.SHOW_COMMENT)

    let point
    while ((point = iter.nextNode() as Comment)) {
      const pid = point.nodeValue!

      if (pid) {
        const childPatch = patchs.get(pid)
        if (childPatch && childPatch.elm) api.replaceChild(point.parentNode!, childPatch.elm, point)
        else if (cbs.replace) {
          let cb
          for (cb of cbs.replace) if (cb(point, pid, that, patchs, compile)) break
        }
      }
    }

    // reference
    if (api.isElement(that.elm!) && that.reference && that.reference.length) {
      let key, obj
      ref: for ([key, obj] of that.reference) {
        if (cbs.reference) {
          let cb
          for (cb of cbs.reference) if (cb(key, obj, that.elm)) continue ref
        }
        if (isPrimitive(obj) || isBoolean(obj) || obj === null) api.setAttribute(that.elm, key, obj)
        else if (key !== 'effects') api.setProperty(that.elm, key, obj)
      }
    }
  }

  const compile = (that: Patch, patchs: Map<string, Patch> = new Map()) => {
    patchs.set(that.root ? '' : that.id!, that)

    patch(that, patchs)

    // create
    if (that.html) {
      that.elm = template(that.html)
    } else if (cbs.create) {
      let cb
      for (cb of cbs.create) if (cb(that, template, compile)) break
    }

    if (that.elm) replace(that, patchs)

    return patchs
  }

  const fragment = (...children: any[]) => {
    const vnode = createVNode('Fragment', { children })
    const that: Patch = { vnode, root: true }
    compile(that)
    return that.elm! as DocumentFragment
  }

  return Object.assign(ctx, { fragment })
}
