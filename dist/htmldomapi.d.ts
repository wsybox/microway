export interface DOMAPI {
    Element: <K extends keyof HTMLElementTagNameMap>(tagName: K, options?: ElementCreationOptions) => HTMLElementTagNameMap[K];
    ElementNS: (namespaceURI: string, qualifiedName: string, options?: ElementCreationOptions) => Element;
    Fragment: () => DocumentFragment;
    Text: (text: string) => Text;
    Comment: (text?: string) => Comment;
    isElement: (node: Node) => node is Element;
    isText: (node: Node) => node is Text;
    isComment: (node: Node) => node is Comment;
    isFragment: (node: Node) => node is DocumentFragment;
    insertBefore: (parentNode: Node, newNode: Node, referenceNode: Node | null) => void;
    removeChild: (node: Node, child: Node) => void;
    appendChild: (node: Node, child: Node) => void;
    replaceChild: (parentNode: Node, newNode: Node, oldChild: Node) => void;
    insertFragmentBefore: (parentNode: Node, newNode: DocumentFragment, referenceNode: Node | null) => void;
    appendFragment: (node: Node, child: DocumentFragment) => void;
    cloneNode: (node: Node, deep?: boolean) => Node;
    parentNode: (node: Node) => Node | null;
    nextSibling: (node: Node) => Node | null;
    append: (parentNode: ParentNode, ...children: (Node | string)[]) => void;
    tagName: (elm: Element) => string;
    getProperty: (node: Node, name: string) => any;
    setProperty: (node: Node, name: string, value: any) => void;
    getAttribute: (node: Element, name: string) => string | null;
    setAttribute: (node: Element, name: string, value?: any) => void;
    getAttributeNS: (node: Element, namespace: string, name: string) => string | null;
    setAttributeNS: (node: Element, namespace: string, name: string, value?: any) => void;
    className: (node: Element, value: any) => void;
    removeEventListener: (node: Element, eventName: string, handler: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions | undefined) => void;
    addEventListener: (node: Element, eventName: string, handler: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions | undefined) => void;
    setTextContent: (node: Node, text: string | null) => void;
    getTextContent: (node: Node) => string | null;
    SVGElements: Set<string>;
}
export declare const htmlDomApi: DOMAPI;
