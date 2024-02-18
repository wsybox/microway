import type { ConText, Hook } from './init';
export declare const signalModule: ({ api, _signal, _actions }: ConText, hook: Hook) => {
    _track: (el: Node, key: string, fn: () => void) => Node;
    _untrack: (el: Node, key?: string) => void;
};
