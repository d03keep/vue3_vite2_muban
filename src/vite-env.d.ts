declare module '*.svga'
declare module 'tim-js-sdk';
declare module 'murmurhash3js';

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare var __ENV__:string
declare var __VERSION__:string
declare var API_URL:string
declare var TCPlayer

interface Window {
  rem2px: Function;
  px2rem: Function;
}
