declare var module: NodeModule;

interface NodeModule {
  id: string;
  hot?: boolean;
}

declare module '*.json' {
  const value: any;
  export default value;
}
