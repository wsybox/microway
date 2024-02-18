const quots = ["'", '"']
export const isStr = (str: string) => quots.some(q => str.startsWith(q) && str.endsWith(q))

export const objectToString = Object.prototype.toString
export const typeTag = (val: unknown): string => objectToString.call(val)

export const isFunction = (val: unknown): val is Function => typeof val === 'function'
export const isArray = Array.isArray
export const isUndef = (s: any): s is undefined => s === void 0
export const isDef = (s: any) => s !== void 0
export const isEmpty = (s: any): s is undefined | null => isUndef(s) || s === null
export const isString = (val: unknown): val is string => typeof val === 'string'
export const isNumber = (val: unknown): val is number => typeof val === 'number'
export const isBoolean = (val: unknown): val is boolean => val === true || val === false
export const isPrimitive = (s: any): s is string | number =>
  isString(s) || isNumber(s) || s instanceof String || s instanceof Number
export const isPlainObject = (val: unknown): val is object => typeTag(val) === '[object Object]'

const reg = /^(?![0-9-_.])[\w-.:]+$/
const err = new Error('compilerToVNode: TemplateStrings format error')

export const compilerToVNode = (strs: TemplateStringsArray, vals: any[]) => {
  let tag: string | undefined
  let tpl = ''
  const data: any[] = []

  if (vals.length === 0) {
    tpl = strs[0]
    tag = tpl.split(/\s+/)[0]
  } else {
    let tags = [...strs.raw]

    // 删除首尾空格
    if (tags.length === 1) tags = [tags[0].trim()]
    else {
      tags.unshift(tags.shift()!.replace(/^\s*/g, ''))
      tags.push(tags.pop()!.replace(/\s*$/g, ''))
    }

    // 根据空格拆分标签头和属性
    tags = tags.map((str: string) => str.split(/\s+/)).flat()

    let prev: string | undefined
    let current: string | undefined
    let val: any
    while (tags.length > 0) {
      current = tags.shift()!

      // 第一个必须是标签名
      if (tag === undefined) {
        if (reg.test(current)) {
          tag = current
          tpl += tag + ' '
        } else throw err
        current = void 0
      }
      // 遇到空字符串或者=结尾代表有插入动态数据
      else if (current === '' || current.endsWith('=')) {
        prev = current
        current = tags.shift()!
        if (current === '') {
          if (prev === '') {
            val = vals.shift()
            if (Object.prototype.toString.call(val) === '[object Object]') {
              data.push(val)
              val = void 0
            } else throw err
          } else {
            const key = prev!.slice(0, -1)
            if (reg.test(key)) {
              val = vals.shift()
              if (['string', 'number', 'boolean'].includes(typeof val)) tpl += `${prev}'${val}' `
              else data.push({ [key]: val })
              val = void 0
            } else throw err
          }
        } else throw err
        prev = void 0
        current = void 0
      }
      // 正常字符串
      else {
        tpl += current + ' '
        current = void 0
      }
    }
  }

  return { tag: tag!, tpl, data }
}
