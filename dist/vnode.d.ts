interface VNodeTypeMap {
    Text: VText;
    Element: VElement;
    Fragment: VFragment;
    Comment: VComment;
}
export type VType = keyof VNodeTypeMap;
export interface VNode {
    type: string;
    children?: any[];
    __IS_VNODE: true;
    [s: string]: any;
}
interface PrimitiveVNode extends VNode {
    children?: [string | number];
}
export interface VElement extends VNode {
    type: 'Element';
    tag: string;
    data: any[];
    tpl: string;
    isSVG: boolean;
}
export interface VText extends PrimitiveVNode {
    type: 'Text';
}
export interface VComment extends PrimitiveVNode {
    type: 'Comment';
}
export interface VFragment extends VNode {
    type: 'Fragment';
}
interface CreateVNodeConfigTypeMap {
    Text: any;
    Element: Omit<VElement, 'type' | '__IS_VNODE'>;
    Fragment: any;
    Comment: any;
}
export declare const isVNode: (obj: any) => obj is VNode;
export declare const isV: <T extends keyof VNodeTypeMap>(type: T, obj: VNode) => obj is VNodeTypeMap[T];
export declare const createVNode: <T extends keyof VNodeTypeMap>(type: T, obj: CreateVNodeConfigTypeMap[T]) => VNodeTypeMap[T];
export {};
