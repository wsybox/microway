import { Way, cbs, ctx, compilerTemp, isBoolean, isPrimitive, isArray } from '.'

const nodesCache = new Map<string, NodeListOf<ChildNode>>()
const template = (html: string) => {
  let nodes = nodesCache.get(html)
  if (!nodes) {
    const t = ctx.api.createElement('template')
    t.innerHTML = html
    nodesCache.set(html, (nodes = t.content.childNodes))
  }

  if (nodes!.length > 1) {
    const f = ctx.api.createDocumentFragment()
    nodes!.forEach(item => ctx.api.append(f, ctx.api.cloneNode(item, true)))
    return f as DocumentFragment
  } else return ctx.api.cloneNode(nodes![0], true) as Element
}

export const render = function ({ data, ns }: Way) {
  let { tag, strs, vals, children: ch } = data

  let dom: Element

  if (strs && strs.length >= 1) {
    let { attr, parm } = compilerTemp(strs, vals!)
    dom = template(`<${tag}${ns ? ` xmlns='${ns}'` : ''} ${attr} />`) as Element
    if (parm.length > 0) compilerParm(dom, parm)
  } else dom = ns ? ctx.api.createElementNS(ns, tag) : ctx.api.createElement(tag)
  if (ch && ch.length > 0) compilerChildren(dom, ch)

  return dom
}

const compilerParm = (elm: Element, parm: any[]) => {
  let item
  for (item of parm) {
    let key
    ref: for (key in item) {
      if (cbs.param) {
        let cb
        for (cb of cbs.param) if (cb(elm, key, item[key])) continue ref
      } else if (isPrimitive(item[key]) || isBoolean(item[key]) || item[key] === null)
        ctx.api.setAttribute(elm, key, item[key])
      else if (!ctx.keywords.includes(key)) ctx.api.setProperty(elm, key, item[key])
    }
  }
}

const isNode = (data: any): data is Element | DocumentFragment | Text | Comment =>
  ctx.api.isElement(data) || ctx.api.isFragment(data) || ctx.api.isText(data) || ctx.api.isComment(data)

export const compilerChildren = (parent: Element | DocumentFragment, ch: any[]) => {
  let i, item: any
  for (i = 0; i < ch.length; i++) {
    item = ch[i]
    if (isNode(item) || typeof item === 'string') ctx.api.append(parent, item)
    else if (typeof item === 'number') ctx.api.append(parent, '' + item)
    else if (item instanceof Way) ctx.api.append(parent, render(item))
    else if (isArray(item) && item.length > 0)
      ctx.api.append(parent, compilerChildren(ctx.api.createDocumentFragment(), item))
    else if (cbs.compile) {
      let cb, dom: any
      for (cb of cbs.compile) {
        dom = cb(item)
        if (dom && isNode(dom)) {
          ctx.api.append(parent, dom)
          dom = void 0
          break
        }
      }
    }

    if (item) item = void 0
  }

  return parent
}
