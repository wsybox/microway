import { getKebabCase, compilerChildren } from '../core'
const dom = document.createElement('div')
const that: any = {}

export const define = new Proxy(that, {
  get: (_, _name: string, __) => (f: (props: any) => Element) => {
    let name = getKebabCase(_name)
    let keys: string[] = []
    let proxy = new Proxy(that, {
      get: (_, p: string) => (keys.push(p), that)
    })
    f.call(dom, proxy)

    customElements.define(
      name,
      class extends HTMLElement {
        static get propKeys() {
          return keys
        }
        constructor() {
          super()
          ;(this as any).__root__ = this.attachShadow({ mode: 'closed' })
          compilerChildren((this as any).__root__, [f((this as any).__props__)])
        }
      }
    )
  }
})

export const definePlugin = ({ keywords }: any, hook: any) => {
  keywords.push('__props__', '__root__')

  hook.param((elm: Element, key: string, val: any) => {
    let kls = customElements.get(elm.tagName.toLowerCase())
    if (kls && (kls as any).propKeys.includes(key)) {
      ;((elm as any).__props__ || ((elm as any).__props__ = {}))[key] = val
      return true
    }
  }, 1)
}
