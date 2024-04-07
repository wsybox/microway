const quots = ["'", '"']
export const isStr = (str: string) => quots.some(q => str.startsWith(q) && str.endsWith(q))

export const objectToString = Object.prototype.toString
export const typeTag = (val: unknown): string => objectToString.call(val)

export const isFunction = (val: unknown): val is Function => typeof val === 'function'
export const isArray = Array.isArray
export const isUndef = (s: any): s is undefined => s === void 0
export const isDef = (s: any) => !isUndef(s)
export const isString = (val: unknown): val is string => typeof val === 'string'
export const isNumber = (val: unknown): val is number => typeof val === 'number'
export const isBoolean = (val: unknown): val is boolean => val === true || val === false
export const isPrimitive = (s: any): s is string | number =>
  isString(s) || isNumber(s) || s instanceof String || s instanceof Number
export const isPlainObject = (val: unknown): val is object => typeTag(val) === '[object Object]'

export const getKebabCase = (str: string) => {
  let temp = str.replace(/[A-Z]/g, i => '-' + i.toLowerCase())
  if (temp.slice(0, 1) === '-') temp = temp.slice(1)
  return temp
}

const reg = /^(?![0-9-_.])[\w-.:]+$/
const err = new Error('compilerTemp: TemplateStrings format error')

export const compilerTemp = (strs: TemplateStringsArray, vals: any[]) => {
  let attr = ''
  const parm: any[] = []

  if (vals.length === 0) attr = strs[0].trim()
  else {
    let tags = [...strs.raw]

    // 删除首尾空格
    tags.unshift(tags.shift()!.replace(/^\s*/g, ''))
    tags.push(tags.pop()!.replace(/\s*$/g, ''))

    // 根据空格拆分标签头和属性
    tags = tags.map((str: string) => str.split(/\s+/)).flat()

    let prev: string | undefined
    let current: string | undefined
    let val: any
    while (tags.length > 0) {
      current = tags.shift()!

      // 遇到空字符串或者=结尾代表有插入动态数据
      if (current === '' || current.endsWith('=')) {
        prev = current
        current = tags.shift()!
        if (current === '') {
          if (prev === '') {
            val = vals.shift()
            if (isPlainObject(val)) {
              parm.push(val)
              val = void 0
            } else throw err
          } else {
            const key = prev!.slice(0, -1)
            if (reg.test(key)) {
              val = vals.shift()
              if (['string', 'number', 'boolean'].includes(typeof val)) attr += `${prev}'${val}' `
              else parm.push({ [key]: val })
              val = void 0
            } else throw err
          }
        } else throw err
        prev = void 0
        current = void 0
      }
      // 正常字符串
      else {
        attr += current + ' '
        current = void 0
      }
    }
  }

  return { attr, parm }
}

export const genhook = <T extends Function = (...args: any[]) => any>(_cbs: any) =>
  new Proxy(_cbs, {
    get: (_, key: string) => (
      _cbs[key] || (_cbs[key] = []),
      Object.assign(
        (fn: T, i?: number) => {
          if (isDef(i) && i! >= 0) _cbs[key].splice(i, 0, fn)
          else _cbs[key].push(fn)
        },
        { get: (i: number) => _cbs[key][i] }
      )
    )
  })
