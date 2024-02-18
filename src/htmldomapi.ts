export interface DOMAPI {
  Element: <K extends keyof HTMLElementTagNameMap>(
    tagName: K,
    options?: ElementCreationOptions
  ) => HTMLElementTagNameMap[K]
  ElementNS: (
    namespaceURI: string,
    qualifiedName: string,
    options?: ElementCreationOptions
  ) => Element
  Fragment: () => DocumentFragment
  Text: (text: string) => Text
  Comment: (text?: string) => Comment

  isElement: (node: Node) => node is Element
  isText: (node: Node) => node is Text
  isComment: (node: Node) => node is Comment
  isFragment: (node: Node) => node is DocumentFragment

  insertBefore: (
    parentNode: Node,
    newNode: Node,
    referenceNode: Node | null
  ) => void
  removeChild: (node: Node, child: Node) => void
  appendChild: (node: Node, child: Node) => void
  replaceChild: (parentNode: Node, newNode: Node, oldChild: Node) => void
  insertFragmentBefore: (
    parentNode: Node,
    newNode: DocumentFragment,
    referenceNode: Node | null
  ) => void
  appendFragment: (node: Node, child: DocumentFragment) => void
  cloneNode: (node: Node, deep?: boolean) => Node
  parentNode: (node: Node) => Node | null
  nextSibling: (node: Node) => Node | null

  append: (parentNode: ParentNode, ...children: (Node | string)[]) => void
  tagName: (elm: Element) => string
  getProperty: (node: Node, name: string) => any
  setProperty: (node: Node, name: string, value: any) => void
  getAttribute: (node: Element, name: string) => string | null
  setAttribute: (node: Element, name: string, value?: any) => void
  getAttributeNS: (
    node: Element,
    namespace: string,
    name: string
  ) => string | null
  setAttributeNS: (
    node: Element,
    namespace: string,
    name: string,
    value?: any
  ) => void
  className: (node: Element, value: any) => void
  removeEventListener: (
    node: Element,
    eventName: string,
    handler: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions | undefined
  ) => void
  addEventListener: (
    node: Element,
    eventName: string,
    handler: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions | undefined
  ) => void
  setTextContent: (node: Node, text: string | null) => void
  getTextContent: (node: Node) => string | null
  SVGElements: Set<string>
}

const Element = <K extends keyof HTMLElementTagNameMap>(
    tagName: K,
    options?: ElementCreationOptions
  ): HTMLElementTagNameMap[K] => document.createElement(tagName, options),
  ElementNS = (
    namespaceURI: string,
    qualifiedName: string,
    options?: ElementCreationOptions
  ): Element => document.createElementNS(namespaceURI, qualifiedName, options),
  Fragment = () => document.createDocumentFragment(),
  Text = (text: string): Text => document.createTextNode(text),
  Comment = (text: string = ''): Comment => document.createComment(text),
  isElement = (node: Node): node is Element => node.nodeType === 1,
  isText = (node: Node): node is Text => node.nodeType === 3,
  isComment = (node: Node): node is Comment => node.nodeType === 8,
  isFragment = (node: Node): node is DocumentFragment => node.nodeType === 11,
  insertBefore = (
    parentNode: Node,
    newNode: Node,
    referenceNode: Node | null
  ): void => {
    parentNode.insertBefore(newNode, referenceNode)
  },
  removeChild = (node: Node, child: Node): void => {
    node.removeChild(child)
  },
  appendChild = (node: Node, child: Node): void => {
    node.appendChild(child)
  },
  replaceChild = (parentNode: Node, newNode: Node, oldChild: Node): void => {
    parentNode.replaceChild(newNode, oldChild)
  },
  cloneNode = (node: Node, deep?: boolean): Node => node.cloneNode(deep),
  parentNode = (node: Node): Node | null => node.parentNode,
  nextSibling = (node: Node): Node | null => node.nextSibling,
  append = (parentNode: ParentNode, ...children: (Node | string)[]): void => {
    parentNode.append(...children)
  },
  tagName = (elm: Element): string => elm.tagName,
  getProperty = (node: Node, name: string) => (<any>node)[name],
  setProperty = (node: Node, name: string, value: any) => {
    ;(<any>node)[name] = value
  },
  emptys = [void 0, null],
  getAttribute = (node: Element, name: string) => node.getAttribute(name),
  setAttribute = (node: Element, name: string, value?: any) => {
    if (emptys.includes(value)) node.removeAttribute(name)
    else node.setAttribute(name, value)
  },
  getAttributeNS = (node: Element, namespace: string, name: string) =>
    node.getAttributeNS(namespace, name),
  setAttributeNS = (
    node: Element,
    namespace: string,
    name: string,
    value?: any
  ) => {
    if (emptys.includes(value)) node.removeAttributeNS(namespace, name)
    else node.setAttributeNS(namespace, name, value)
  },
  className = (node: Element, value?: any) => {
    if (emptys.includes(value)) node.removeAttribute('class')
    else node.className = value
  },
  addEventListener = (
    node: Element,
    event: string,
    handler: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions | undefined
  ) => {
    node.addEventListener(event, handler, options)
  },
  removeEventListener = (
    node: Element,
    event: string,
    handler: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions | undefined
  ) => {
    node.removeEventListener(event, handler, options)
  },
  setTextContent = (node: Node, text: string | null): void => {
    node.textContent = text
  },
  getTextContent = (node: Node): string | null => node.textContent,
  SVGElements = new Set([
    // "a",
    'altGlyph',
    'altGlyphDef',
    'altGlyphItem',
    'animate',
    'animateColor',
    'animateMotion',
    'animateTransform',
    'circle',
    'clipPath',
    'color-profile',
    'cursor',
    'defs',
    'desc',
    'ellipse',
    'feBlend',
    'feColorMatrix',
    'feComponentTransfer',
    'feComposite',
    'feConvolveMatrix',
    'feDiffuseLighting',
    'feDisplacementMap',
    'feDistantLight',
    'feFlood',
    'feFuncA',
    'feFuncB',
    'feFuncG',
    'feFuncR',
    'feGaussianBlur',
    'feImage',
    'feMerge',
    'feMergeNode',
    'feMorphology',
    'feOffset',
    'fePointLight',
    'feSpecularLighting',
    'feSpotLight',
    'feTile',
    'feTurbulence',
    'filter',
    'font',
    'font-face',
    'font-face-format',
    'font-face-name',
    'font-face-src',
    'font-face-uri',
    'foreignObject',
    'g',
    'glyph',
    'glyphRef',
    'hkern',
    'image',
    'line',
    'linearGradient',
    'marker',
    'mask',
    'metadata',
    'missing-glyph',
    'mpath',
    'path',
    'pattern',
    'polygon',
    'polyline',
    'radialGradient',
    'rect',
    // "script",
    'set',
    'stop',
    // "style",
    'svg',
    'switch',
    'symbol',
    'text',
    'textPath',
    // "title",
    'tref',
    'tspan',
    'use',
    'view',
    'vkern'
  ])

export const htmlDomApi: DOMAPI = {
  Element,
  ElementNS,
  Text,
  Fragment,
  Comment,

  isElement,
  isText,
  isComment,
  isFragment,

  insertBefore,
  removeChild,
  appendChild,
  replaceChild,
  insertFragmentBefore: insertBefore,
  appendFragment: appendChild,
  cloneNode,
  parentNode,
  nextSibling,

  append,
  tagName,
  getProperty,
  setProperty,
  getAttribute,
  setAttribute,
  getAttributeNS,
  setAttributeNS,
  className,
  addEventListener,
  removeEventListener,
  setTextContent,
  getTextContent,
  SVGElements
}
