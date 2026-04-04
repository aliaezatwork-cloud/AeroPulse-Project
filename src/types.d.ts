declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
  interface ElementClass {}
  interface ElementAttributesProperty { props: {}; }
  interface ElementChildrenAttribute { children: {}; }
  interface IntrinsicAttributes { [name: string]: any; }
}

declare module 'react' {
  export type SetStateAction<S> = S | ((prevState: S) => S);
  export type Dispatch<A> = (value: A) => void;
  export function useState<S>(initialState: S): [S, Dispatch<SetStateAction<S>>];
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  export type ChangeEvent<T = Element> = Event & { target: EventTarget & { value: any; files?: FileList | null } };
  export function useMemo<T>(factory: () => T, deps?: any[]): T;
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps?: any[]): T;
  export function createElement(type: any, props: any, ...children: any[]): any;
  export interface Attributes {
    children?: any;
  }
  export namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

declare module 'react/jsx-runtime' {
  export function jsx(type: any, props: any, key?: any): any;
  export function jsxs(type: any, props: any, key?: any): any;
  export function jsxDEV(type: any, props: any, key?: any, isStaticChildren?: any, source?: any, self?: any): any;
}

declare module 'react/jsx-dev-runtime' {
  export function jsxDEV(type: any, props: any, key?: any, isStaticChildren?: any, source?: any, self?: any): any;
}

declare module 'react-dom/client' {
  export function createRoot(container: Element): { render(element: any): void };
}

declare module 'motion/react' {
  export const motion: any;
  export const AnimatePresence: any;
}

declare module 'lucide-react' {
  export const Cpu: any;
  export const ShieldCheck: any;
  export const Infinity: any;
  export const ChevronRight: any;
  export const Activity: any;
  export const Zap: any;
  export const Clock: any;
  export const Menu: any;
  export const X: any;
  export const Languages: any;
  export const Sun: any;
  export const Moon: any;
  export const LogOut: any;
  export const User: any;
  export const Settings: any;
  export const Package: any;
  export const Edit3: any;
  export const Play: any;
  export const Heart: any;
  export const Battery: any;
  export const Shield: any;
  export const Info: any;
}

declare module '@google/genai' {
  export class GoogleGenAI {
    constructor(options: { apiKey: string });
    models: { generateContent(options: any): Promise<any> };
  }
}

declare module 'firebase/app' {
  export function initializeApp(config: any): any;
}

declare module 'firebase/auth' {
  export const getAuth: any;
  export const GoogleAuthProvider: any;
  export const signInWithPopup: any;
  export const signOut: any;
  export const onAuthStateChanged: any;
  export type User = any;
}

declare module 'firebase/firestore' {
  export const getFirestore: any;
  export const doc: any;
  export const getDocFromServer: any;
  export const collection: any;
  export const addDoc: any;
  export const query: any;
  export const where: any;
  export const onSnapshot: any;
  export const serverTimestamp: any;
  export const orderBy: any;
  export const setDoc: any;
  export const updateDoc: any;
}

declare module '*.json' {
  const value: any;
  export default value;
}
