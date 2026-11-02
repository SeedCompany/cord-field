declare module 'webpack-bundle-analyzer' {
  import type { RspackPluginInstance } from '@rspack/core';

  export class BundleAnalyzerPlugin implements RspackPluginInstance {
    constructor(options?: {
      analyzerMode?: 'server' | 'static' | 'json' | 'disabled';
      reportFilename?: string;
      openAnalyzer?: boolean;
    });
    apply: RspackPluginInstance['apply'];
  }
}
