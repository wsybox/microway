export declare const isStr: (str: string) => boolean;
export declare const objectToString: () => string;
export declare const typeTag: (val: unknown) => string;
export declare const isFunction: (val: unknown) => val is Function;
export declare const isArray: (arg: any) => arg is any[];
export declare const isUndef: (s: any) => s is undefined;
export declare const isDef: (s: any) => boolean;
export declare const isEmpty: (s: any) => s is null | undefined;
export declare const isString: (val: unknown) => val is string;
export declare const isNumber: (val: unknown) => val is number;
export declare const isBoolean: (val: unknown) => val is boolean;
export declare const isPrimitive: (s: any) => s is string | number;
export declare const isPlainObject: (val: unknown) => val is object;
export declare const compilerToVNode: (strs: TemplateStringsArray, vals: any[]) => {
    tag: string;
    tpl: string;
    data: any[];
};
