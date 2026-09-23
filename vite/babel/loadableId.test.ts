import { transformSync } from '@babel/core';
import path from 'node:path';
import { loadableId } from './loadableId';

// Not `import.meta.url`: under the jsdom environment that is an http URL.
// Vitest runs from the repo root.
const root = process.cwd();

/**
 * The fixtures resolve against the repo's *real* files rather than a temp
 * tree, so the asserted ids are the ids the app will actually emit.
 */
const file = (relative: string) => path.join(root, relative);

const transform = (
  code: string,
  filename: string,
  callerOpts: { ssr?: boolean } = {}
) =>
  transformSync(code, {
    filename,
    babelrc: false,
    configFile: false,
    // Plain JS fixtures, so no TS/JSX syntax plugin is needed.
    sourceType: 'module',
    // A fresh plugin instance per call, so nothing leaks between tests.
    plugins: [[loadableId, { root }]],
    caller: { name: 'test', supportsStaticESM: true, ...callerOpts },
  })?.code ?? '';

describe('loadableId babel plugin', () => {
  it('injects a root-relative posix id for a default import', () => {
    const out = transform(
      `import loadable from '@loadable/component';
       const Partners = loadable(() => import('../Partners'), {
         resolveComponent: (m) => m.Partners,
       });`,
      file('src/scenes/Root/Root.tsx')
    );
    // Directory resolved through its index.ts.
    expect(out).toContain(`loadableId: "src/scenes/Partners/index.ts"`);
  });

  it('injects for a named import from the Loadable module', () => {
    const out = transform(
      `import { loadable } from '~/components/Loadable';
       const Budget = loadable(() => import('./Budget'), {});`,
      file('src/scenes/Projects/Projects.tsx')
    );
    expect(out).toContain(`loadableId: "src/scenes/Projects/Budget/index.ts"`);
  });

  it('follows an aliased named binding', () => {
    const out = transform(
      `import { loadable as lazyPage } from '~/components/Loadable';
       const Budget = lazyPage(() => import('./Budget'), {});`,
      file('src/scenes/Projects/Projects.tsx')
    );
    expect(out).toContain(`loadableId: "src/scenes/Projects/Budget/index.ts"`);
  });

  it('follows an aliased default binding', () => {
    const out = transform(
      `import lazyPage from '@loadable/component';
       const Budget = lazyPage(() => import('./Budget'), {});`,
      file('src/scenes/Projects/Projects.tsx')
    );
    expect(out).toContain(`loadableId: "src/scenes/Projects/Budget/index.ts"`);
  });

  it('injects into loadable.lib calls', () => {
    const out = transform(
      `import loadable from '@loadable/component';
       const Tools = loadable.lib(() => import('./editorJsTools'), {
         ssr: false,
       });`,
      file('src/components/RichText/RichTextField.tsx')
    );
    expect(out).toContain(
      `loadableId: "src/components/RichText/editorJsTools.ts"`
    );
    // The existing options survive.
    expect(out).toContain('ssr: false');
  });

  it('resolves a file before a same-named directory', () => {
    const out = transform(
      `import loadable from '@loadable/component';
       const P = loadable(() => import('./Partners'), {});`,
      file('src/scenes/Partners/index.ts')
    );
    expect(out).toContain(`loadableId: "src/scenes/Partners/Partners.tsx"`);
  });

  it('creates the options object when the call has no second argument', () => {
    const out = transform(
      `import loadable from '@loadable/component';
       const P = loadable(() => import('../Partners'));`,
      file('src/scenes/Root/Root.tsx')
    );
    expect(out).toContain(`loadableId: "src/scenes/Partners/index.ts"`);
  });

  it('creates the options object for a bare loadable.lib call', () => {
    const out = transform(
      `import loadable from '@loadable/component';
       const T = loadable.lib(() => import('./editorJsTools'));`,
      file('src/components/RichText/RichTextField.tsx')
    );
    expect(out).toContain(
      `loadableId: "src/components/RichText/editorJsTools.ts"`
    );
  });

  it('skips bare package specifiers, which have no manifest key', () => {
    const out = transform(
      `import loadable from '@loadable/component';
       const Lib = loadable.lib(() => import('react-editor-js'), {
         ssr: false,
       });`,
      file('src/components/RichText/RichTextField.tsx')
    );
    expect(out).not.toContain('loadableId');
  });

  it('leaves an existing loadableId alone', () => {
    const out = transform(
      `import loadable from '@loadable/component';
       const P = loadable(() => import('../Partners'), {
         loadableId: 'hand/written',
       });`,
      file('src/scenes/Root/Root.tsx')
    );
    expect(out).toContain(`loadableId: 'hand/written'`);
    expect(out).not.toContain('src/scenes/Partners');
  });

  it('is idempotent', () => {
    const source = `import loadable from '@loadable/component';
       const P = loadable(() => import('../Partners'), {});`;
    const filename = file('src/scenes/Root/Root.tsx');
    const once = transform(source, filename);
    const twice = transform(once, filename);
    expect(twice.match(/loadableId/g)).toHaveLength(1);
  });

  it('ignores a loadable imported from somewhere else', () => {
    const out = transform(
      `import loadable from 'some-other-loader';
       const P = loadable(() => import('../Partners'), {});`,
      file('src/scenes/Root/Root.tsx')
    );
    expect(out).not.toContain('loadableId');
  });

  it('ignores a local binding that shadows the import', () => {
    const out = transform(
      `import loadable from '@loadable/component';
       function make() {
         const loadable = (f) => f;
         return loadable(() => import('../Partners'), {});
       }`,
      file('src/scenes/Root/Root.tsx')
    );
    expect(out).not.toContain('loadableId');
  });

  it('leaves a non-object options argument alone', () => {
    const out = transform(
      `import loadable from '@loadable/component';
       const opts = { ssr: false };
       const P = loadable(() => import('../Partners'), opts);`,
      file('src/scenes/Root/Root.tsx')
    );
    expect(out).not.toContain('loadableId');
  });

  it('skips a specifier that resolves to nothing', () => {
    const out = transform(
      `import loadable from '@loadable/component';
       const P = loadable(() => import('./NoSuchModule'), {});`,
      file('src/scenes/Root/Root.tsx')
    );
    expect(out).not.toContain('loadableId');
  });

  it('emits identical ids for the client and SSR builds', () => {
    const source = `import loadable from '@loadable/component';
       const Partners = loadable(() => import('../Partners'), {});
       const Tools = loadable.lib(() => import('../Tools'));`;
    const filename = file('src/scenes/Root/Root.tsx');
    // This is the property the whole design rests on: the plugin reads only
    // the source text, the importer's filename and the configured root, so a
    // differing Babel caller (which is how plugin-react signals the SSR pass)
    // cannot change what it emits.
    expect(transform(source, filename, { ssr: true })).toEqual(
      transform(source, filename, { ssr: false })
    );
  });
});
