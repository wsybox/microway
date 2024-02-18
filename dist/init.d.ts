import type { VNode } from './vnode';
import type { DOMAPI } from './htmldomapi';
type ParentElement = Element | DocumentFragment;
type LegalElement = ParentElement | Text | Comment;
export type Patch = {
    root?: boolean;
    parent?: Patch;
    only?: boolean;
    id?: string;
    html?: string;
    vnode: VNode;
    elm?: LegalElement;
    reference?: any[];
} & Obj;
type BaseConText = {
    api: DOMAPI;
};
type Obj = {
    [key in string]: any;
};
export type ConText = BaseConText & Obj;
type LifeCycleHooks = {
    transform: (obj: any) => VNode | undefined;
    identify: (vnode: VNode, parent: Patch, patchs: Map<string, Patch>, compile: (that: Patch, patchs?: Map<string, Patch>) => Map<string, Patch>, only: boolean) => VNode | undefined;
    patch: (key: string, val: any, reference: any[]) => boolean | undefined;
    create: (that: Patch, template: (html: string) => DocumentFragment | Element | undefined, compile: (that: Patch, patchs?: Map<string, Patch>) => Map<string, Patch>) => boolean | undefined;
    replace: (point: Comment, pid: string, that: Patch, patchs: Map<string, Patch>, compile: (that: Patch, patchs?: Map<string, Patch>) => Map<string, Patch>) => boolean | undefined;
    reference: (key: string, val: any, elm: Element) => boolean | undefined;
};
type HookName = keyof LifeCycleHooks;
export type Hook = {
    get: <T extends HookName>(name: T) => Array<LifeCycleHooks[T]>;
    add: <T extends HookName>(name: T, fns: any) => void;
};
type Module = Obj | (<T extends Obj>(ctx: Obj, hook: Hook) => T);
export declare const isHookName: (name: string) => name is keyof LifeCycleHooks;
export declare const l: (strs: TemplateStringsArray, ...vals: any[]) => ((...children: any[]) => {
    children: any[];
    [Symbol.toStringTag]: string;
    strs: TemplateStringsArray;
    vals: any[];
}) & {
    [Symbol.toStringTag]: string;
    strs: TemplateStringsArray;
    vals: any[];
};
export declare const init: (...modules: Module[]) => BaseConText & Obj & {
    fragment: (...children: any[]) => DocumentFragment;
};
export {};
