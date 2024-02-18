interface VNodeTypeMap {
  Text: VText
  Element: VElement
  Fragment: VFragment
  Comment: VComment
}

export type VType = keyof VNodeTypeMap

export interface VNode {
  type: string
  children?: any[]
  __IS_VNODE: true
  [s: string]: any
}
interface PrimitiveVNode extends VNode {
  children?: [string | number]
}
export interface VElement extends VNode {
  type: 'Element'
  tag: string
  data: any[]
  tpl: string
  isSVG: boolean
}
export interface VText extends PrimitiveVNode {
  type: 'Text'
}
export interface VComment extends PrimitiveVNode {
  type: 'Comment'
}
export interface VFragment extends VNode {
  type: 'Fragment'
}

interface CreateVNodeConfigTypeMap {
  Text: any
  Element: Omit<VElement, 'type' | '__IS_VNODE'>
  Fragment: any
  Comment: any
}

export const isVNode = (obj: any): obj is VNode =>
  obj && obj.hasOwnProperty('__IS_VNODE') && obj['__IS_VNODE']

export const isV = <T extends VType>(type: T, obj: VNode): obj is VNodeTypeMap[T] =>
  obj.type === type

export const createVNode = <T extends VType>(
  type: T,
  obj: CreateVNodeConfigTypeMap[T]
): VNodeTypeMap[T] => {
  let rv: any
  if (type === 'Text' || type === 'Comment') rv = { children: [obj] }
  else rv = obj
  rv.type = type
  rv['__IS_VNODE'] = true
  return rv as unknown as VNodeTypeMap[T]
}
