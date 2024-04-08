export interface DOMAPI {
  createElement: <K extends keyof HTMLElementTagNameMap>(
    tagName: K,
    options?: ElementCreationOptions
  ) => HTMLElementTagNameMap[K]
  createElementNS: (namespaceURI: string, qualifiedName: string, options?: ElementCreationOptions) => Element
  createDocumentFragment: () => DocumentFragment
  createTextNode: (text: string) => Text
  createComment: (text?: string) => Comment
  isElement: (node: Node) => node is Element
  isText: (node: Node) => node is Text
  isComment: (node: Node) => node is Comment
  isFragment: (node: Node) => node is DocumentFragment
  insertBefore: (parentNode: Node, newNode: Node, Node: Node | null) => Node
  removeChild: (node: Node, child: Node) => Node
  appendChild: (node: Node, child: Node) => Node
  replaceChild: (parentNode: Node, newNode: Node, oldChild: Node) => Node
  cloneNode: (node: Node, deep?: boolean) => Node
  parentNode: (node: Node) => Node | null
  nextSibling: (node: Node) => Node | null
  append: (parentNode: ParentNode, ...children: (Node | string)[]) => void
  getProperty: (node: Node, name: string) => any
  setProperty: (node: Node, name: string, value: any) => void

  setTextContent: (node: Node, text: string | null) => void
  getTextContent: (node: Node) => string | null
  tagName: (elm: Element) => string
  getAttribute: (elm: Element, name: string) => string | null
  setAttribute: (elm: Element, name: string, value?: any) => void
  getAttributeNS: (elm: Element, namespace: string, name: string) => string | null
  setAttributeNS: (elm: Element, namespace: string, name: string, value?: any) => void
  className: (elm: Element, value: any) => void
  classList: (elm: Element) => DOMTokenList
  removeEventListener: (
    elm: Element,
    eventName: string,
    handler: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions | undefined
  ) => void
  addEventListener: (
    elm: Element,
    eventName: string,
    handler: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions | undefined
  ) => void
}

const emptys = [void 0, null]
const createElement = <K extends keyof HTMLElementTagNameMap>(
    tagName: K,
    options?: ElementCreationOptions
  ): HTMLElementTagNameMap[K] => document.createElement(tagName, options),
  createElementNS = (namespaceURI: string, qualifiedName: string, options?: ElementCreationOptions): Element =>
    document.createElementNS(namespaceURI, qualifiedName, options),
  createDocumentFragment = () => document.createDocumentFragment(),
  createTextNode = (text: string): Text => document.createTextNode(text),
  createComment = (text: string = ''): Comment => document.createComment(text),
  isElement = (node: Node): node is Element => node instanceof Element,
  isText = (node: Node): node is Text => node instanceof Text,
  isComment = (node: Node): node is Comment => node instanceof Comment,
  isFragment = (node: Node): node is DocumentFragment => node instanceof DocumentFragment,
  insertBefore = (parentNode: Node, newNode: Node, Node: Node | null) => parentNode.insertBefore(newNode, Node),
  removeChild = (node: Node, child: Node) => node.removeChild(child),
  appendChild = (node: Node, child: Node) => node.appendChild(child),
  replaceChild = (parentNode: Node, newNode: Node, oldChild: Node) => parentNode.replaceChild(newNode, oldChild),
  cloneNode = (node: Node, deep?: boolean): Node => node.cloneNode(deep),
  parentNode = (node: Node): Node | null => node.parentNode,
  nextSibling = (node: Node): Node | null => node.nextSibling,
  append = (parentNode: ParentNode, ...children: (Node | string)[]): void => {
    parentNode.append(...children)
  },
  getProperty = (node: Node, name: string) => (<any>node)[name],
  setProperty = (node: Node, name: string, value: any) => {
    ;(<any>node)[name] = value
  },
  setTextContent = (node: Node, text: string | null): void => {
    node.textContent = text
  },
  getTextContent = (node: Node): string | null => node.textContent,
  tagName = (elm: Element): string => elm.tagName,
  getAttribute = (elm: Element, name: string) => elm.getAttribute(name),
  setAttribute = (elm: Element, name: string, value?: any) => {
    if (emptys.includes(value)) elm.removeAttribute(name)
    else elm.setAttribute(name, value)
  },
  getAttributeNS = (elm: Element, namespace: string, name: string) => elm.getAttributeNS(namespace, name),
  setAttributeNS = (elm: Element, namespace: string, name: string, value?: any) => {
    if (emptys.includes(value)) elm.removeAttributeNS(namespace, name)
    else elm.setAttributeNS(namespace, name, value)
  },
  className = (elm: Element, value?: any) => {
    if (emptys.includes(value)) elm.removeAttribute('class')
    else elm.className = value
  },
  classList = (elm: Element) => elm.classList,
  addEventListener = (
    elm: Element,
    event: string,
    handler: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions | undefined
  ) => {
    elm.addEventListener(event, handler, options)
  },
  removeEventListener = (
    elm: Element,
    event: string,
    handler: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions | undefined
  ) => {
    elm.removeEventListener(event, handler, options)
  }

export const api: DOMAPI = {
  createElement,
  createElementNS,
  createDocumentFragment,
  createTextNode,
  createComment,
  isElement,
  isText,
  isComment,
  isFragment,
  insertBefore,
  removeChild,
  appendChild,
  replaceChild,
  cloneNode,
  parentNode,
  nextSibling,
  append,
  getProperty,
  setProperty,

  setTextContent,
  getTextContent,
  tagName,
  getAttribute,
  setAttribute,
  getAttributeNS,
  setAttributeNS,
  className,
  classList,
  removeEventListener,
  addEventListener
}
