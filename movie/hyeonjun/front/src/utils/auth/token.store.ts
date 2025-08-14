let accessTokenInMemory: string | null = null;

export enum Reason {
  set,
  clear,
}

type Listener = (r: Reason, token: string) => void;

const key = 'AccessToken';
const listeners = new Set<Listener>();

function notify(r: Reason) {
  listeners.forEach(fn => fn(r, accessTokenInMemory ?? ''));
}

export const tokenStore = {
  get: () => accessTokenInMemory ?? sessionStorage.getItem(key),
  set: (t: string) => {
    accessTokenInMemory = t;
    sessionStorage.setItem(key, t);
    notify(Reason.set);
  },
  clear: () => {
    accessTokenInMemory = null;
    sessionStorage.removeItem(key);
    notify(Reason.clear);
  },
  subscribe: (fn: Listener) => {
    listeners.add(fn);
    // 반환 함수가 void가 되도록 블록 사용
    return () => {
      listeners.delete(fn);
    };
  },
};
