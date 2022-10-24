/* eslint-disable import/no-default-export,import/newline-after-import,import-helpers/order-imports */

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly PUBLIC_URL?: string;
  }
}

declare module '*.avif' {
  const src: string;
  export default src;
}

declare module '*.bmp' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  import { Component, SVGProps } from 'react';

  export const ReactComponent: Component<
    SVGProps<SVGSVGElement> & { title?: string }
  >;

  const src: string;
  export default src;
}

declare module '@editorjs/checklist' {
  import { ToolConstructable } from '@editorjs/editorjs';
  const tool: ToolConstructable;
  export default tool;
}
declare module '@editorjs/code' {
  import { ToolConstructable } from '@editorjs/editorjs';
  const tool: ToolConstructable;
  export default tool;
}
declare module '@editorjs/delimiter' {
  import { ToolConstructable } from '@editorjs/editorjs';
  const tool: ToolConstructable;
  export default tool;
}
declare module '@editorjs/embed' {
  import { ToolConstructable } from '@editorjs/editorjs';
  const tool: ToolConstructable;
  export default tool;
}
declare module '@editorjs/header' {
  import { ToolConstructable } from '@editorjs/editorjs';
  const tool: ToolConstructable;
  export default tool;
}
declare module '@editorjs/image' {
  import { ToolConstructable } from '@editorjs/editorjs';
  const tool: ToolConstructable;
  export default tool;
}
declare module '@editorjs/inline-code' {
  import { ToolConstructable } from '@editorjs/editorjs';
  const tool: ToolConstructable;
  export default tool;
}
declare module '@editorjs/link' {
  import { ToolConstructable } from '@editorjs/editorjs';
  const tool: ToolConstructable;
  export default tool;
}
declare module '@editorjs/list' {
  import { ToolConstructable } from '@editorjs/editorjs';
  const tool: ToolConstructable;
  export default tool;
}
declare module '@editorjs/marker' {
  import { ToolConstructable } from '@editorjs/editorjs';
  const tool: ToolConstructable;
  export default tool;
}
declare module '@editorjs/paragraph' {
  import { ToolConstructable } from '@editorjs/editorjs';
  const tool: ToolConstructable;
  export default tool;
}
declare module '@editorjs/quote' {
  import { ToolConstructable } from '@editorjs/editorjs';
  const tool: ToolConstructable;
  export default tool;
}
declare module '@editorjs/raw' {
  import { ToolConstructable } from '@editorjs/editorjs';
  const tool: ToolConstructable;
  export default tool;
}
declare module '@editorjs/simple-image' {
  import { ToolConstructable } from '@editorjs/editorjs';
  const tool: ToolConstructable;
  export default tool;
}
declare module '@editorjs/table' {
  import { ToolConstructable } from '@editorjs/editorjs';
  const tool: ToolConstructable;
  export default tool;
}
declare module '@editorjs/warning' {
  import { ToolConstructable } from '@editorjs/editorjs';
  const tool: ToolConstructable;
  export default tool;
}
