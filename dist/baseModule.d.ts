import type { Hook } from './init';
export declare const baseModule: (_: any, hook: Hook) => {
    _actions: {
        get: (key: string) => any;
        add: (key: string, fn: () => boolean | undefined) => void;
    };
};
