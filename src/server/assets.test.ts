import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  ChunkCollector,
  loadable,
  whenLoadablesSettle,
} from '~/components/Loadable';
import { renderAssets } from './assets';

/**
 * A miniature of what `vite build --manifest` writes: one entry chunk with a
 * stylesheet and one static import, which itself statically imports a third.
 */
const clientManifest = {
  'src/client.tsx': {
    file: 'static/client.aaaaaaaa.js',
    src: 'src/client.tsx',
    isEntry: true,
    imports: ['_vendor.bbbbbbbb.js'],
    css: ['static/client.cccccccc.css'],
  },
  '_vendor.bbbbbbbb.js': {
    file: 'static/vendor.bbbbbbbb.js',
    imports: ['_deep.dddddddd.js'],
  },
  '_deep.dddddddd.js': {
    file: 'static/deep.dddddddd.js',
    css: ['static/deep.eeeeeeee.css'],
  },
  'src/scenes/Partners/index.ts': {
    file: 'static/Partners.ffffffff.js',
    src: 'src/scenes/Partners/index.ts',
    isDynamicEntry: true,
  },
};

/** What `--ssrManifest` writes: source module id -> public asset paths. */
const ssrManifest = {
  'src/scenes/Partners/index.ts': [
    '/static/Partners.ffffffff.js',
    '/static/Partners.99999999.css',
    '/static/sofia-pro.12121212.woff2',
    '/static/background.34343434.png',
  ],
};

const dir = mkdtempSync(join(tmpdir(), 'cord-assets-'));
const write = (name: string, content: unknown) => {
  const path = join(dir, name);
  writeFileSync(path, JSON.stringify(content));
  return path;
};
const clientPath = write('manifest.json', clientManifest);
const ssrPath = write('ssr-manifest.json', ssrManifest);

const env = { ...process.env };
const setEnv = (values: Record<string, string | undefined>) => {
  for (const [key, value] of Object.entries(values)) {
    if (value === undefined) {
      // Assigning `undefined` to `process.env` stores the *string*
      // `"undefined"`, which reads as a perfectly valid path.
      Reflect.deleteProperty(process.env, key);
    } else {
      process.env[key] = value;
    }
  }
};

beforeEach(() => {
  setEnv({
    NODE_ENV: 'production',
    PUBLIC_URL: undefined,
    CLIENT_MANIFEST_PATH: clientPath,
    SSR_MANIFEST_PATH: ssrPath,
  });
});

afterEach(() => {
  process.env = { ...env };
});

describe('renderAssets in development', () => {
  it('serves the raw entry through Vite', () => {
    setEnv({ NODE_ENV: 'development' });
    const { links, scripts } = renderAssets([]);
    expect(links).toBe('');
    expect(scripts).toContain('src="/src/client.tsx"');
    // `/@vite/client` is injected by `vite.transformIndexHtml` in
    // `renderServerSideApp`, not here — emitting it in both places would load
    // the HMR client twice.
    expect(scripts).not.toContain('@vite/client');
  });

  it('needs no manifest', () => {
    setEnv({
      NODE_ENV: 'development',
      CLIENT_MANIFEST_PATH: undefined,
      SSR_MANIFEST_PATH: undefined,
    });
    expect(() => renderAssets(['src/scenes/Partners/index.ts'])).not.toThrow();
  });
});

describe('renderAssets in production', () => {
  it('emits the entry script, its CSS and its transitive imports', () => {
    const { links, scripts } = renderAssets([]);
    expect(scripts).toBe(
      '<script type="module" crossorigin src="/static/client.aaaaaaaa.js"></script>'
    );
    expect(links).toContain(
      '<link rel="stylesheet" href="/static/client.cccccccc.css">'
    );
    expect(links).toContain(
      '<link rel="modulepreload" href="/static/vendor.bbbbbbbb.js">'
    );
    // Transitive, not just direct.
    expect(links).toContain(
      '<link rel="modulepreload" href="/static/deep.dddddddd.js">'
    );
    expect(links).toContain(
      '<link rel="stylesheet" href="/static/deep.eeeeeeee.css">'
    );
  });

  it('preloads the rendered modules from the ssr manifest', () => {
    const { links } = renderAssets(['src/scenes/Partners/index.ts']);
    expect(links).toContain(
      '<link rel="modulepreload" href="/static/Partners.ffffffff.js">'
    );
    expect(links).toContain(
      '<link rel="stylesheet" href="/static/Partners.99999999.css">'
    );
    expect(links).toContain(
      '<link rel="preload" as="font" crossorigin href="/static/sofia-pro.12121212.woff2">'
    );
    // Not JS, CSS or a font: no tag rather than a guessed `as`.
    expect(links).not.toContain('background.34343434.png');
  });

  it('applies PUBLIC_URL at render time, not at build time', () => {
    setEnv({ PUBLIC_URL: 'https://cdn.example.com/app' });
    const { links, scripts } = renderAssets(['src/scenes/Partners/index.ts']);
    expect(scripts).toContain(
      'src="https://cdn.example.com/app/static/client.aaaaaaaa.js"'
    );
    expect(links).toContain(
      'href="https://cdn.example.com/app/static/Partners.ffffffff.js"'
    );
    // Same manifest, a different prefix, no rebuild.
    setEnv({ PUBLIC_URL: '/other/' });
    expect(renderAssets([]).scripts).toContain(
      'src="/other/static/client.aaaaaaaa.js"'
    );
  });

  it('skips ids that are not manifest keys', () => {
    // `RichTextField` hand-writes `loadableId: 'react-editor-js'`, which is a
    // bare package specifier and so never a manifest key.
    const { links } = renderAssets(['react-editor-js', 'src/nope.ts']);
    expect(links).not.toContain('react-editor-js');
    expect(links).not.toContain('nope');
  });

  it('degrades to no tags when a manifest is missing', () => {
    setEnv({
      CLIENT_MANIFEST_PATH: join(dir, 'does-not-exist.json'),
      SSR_MANIFEST_PATH: undefined,
    });
    const { links, scripts } = renderAssets(['src/scenes/Partners/index.ts']);
    expect(links).toBe('');
    expect(scripts).toBe('');
  });

  it('does not repeat a tag reached by two paths', () => {
    const { links } = renderAssets([
      'src/scenes/Partners/index.ts',
      'src/scenes/Partners/index.ts',
    ]);
    const occurrences = links.split('static/Partners.ffffffff.js').length - 1;
    expect(occurrences).toBe(1);
  });
});

/**
 * The half that cannot be checked against a real build yet: Razzle still
 * builds the app, so there is no Vite manifest to read and no authenticated
 * route to server-render. This closes the loop with the same pieces
 * `renderServerSideApp` wires together — a rendered loadable's id reaching
 * `renderAssets` as a preload tag.
 */
describe('collected ids to asset tags', () => {
  it('turns a rendered loadable into preload tags for its chunk', async () => {
    // `loadable` treats a missing `window` as the server, which is what makes
    // it fire the import at definition time and record into the collector.
    vi.stubGlobal('window', undefined);
    try {
      const Partners = loadable(
        () => Promise.resolve({ Partners: () => createElement('span') }),
        {
          loadableId: 'src/scenes/Partners/index.ts',
          resolveComponent: (m) => m.Partners,
        }
      );
      await whenLoadablesSettle();

      const collector = new ChunkCollector();
      renderToStaticMarkup(collector.wrap(createElement(Partners)));
      expect(collector.chunkIds).toEqual(['src/scenes/Partners/index.ts']);

      const { links } = renderAssets(collector.chunkIds);
      expect(links).toContain(
        '<link rel="modulepreload" href="/static/Partners.ffffffff.js">'
      );
      expect(links).toContain(
        '<link rel="stylesheet" href="/static/Partners.99999999.css">'
      );
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
