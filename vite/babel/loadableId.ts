import type { types as BabelTypes, PluginObj } from '@babel/core';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Injects a stable `loadableId` into every `loadable()` / `loadable.lib()`
 * call site, replacing `@loadable/babel-plugin`.
 *
 * The id is the imported module's **root-relative, posix-separated source
 * path** — e.g. `src/scenes/Partners/index.ts` — which is the same key format
 * Vite's `--ssrManifest` uses, so the server can look a chunk up by the id it
 * collected while rendering.
 *
 * ## Why this is a Babel plugin and not a Rollup transform
 *
 * The ids have to be byte-identical in the client build and the SSR build, or
 * `loadableReady`'s registry lookup silently finds nothing. Babel is the one
 * transform that runs in both, so running there is what makes the two builds
 * agree by construction. It is also already on the hot path for
 * `@emotion/babel-plugin`, so the marginal cost is ~zero — and unlike a Rollup
 * `transform` it sees the source before TS/JSX stripping, with no ordering
 * fragility against `vite:esbuild`.
 *
 * ## Why resolution can be synchronous
 *
 * Babel plugins cannot await. They do not need to here: every specifier at
 * every call site in this repo is either relative, `~/`-aliased, or a bare
 * package name — and bare packages are skipped, since they have no
 * manifest key.
 */

export interface LoadableIdOptions {
  /** Repo root that ids are made relative to. Defaults to `process.cwd()`. */
  root?: string;
  /**
   * Module specifiers whose `loadable` export this plugin should treat as
   * ours. A bare entry matches the written specifier; a root-relative entry
   * matches the *resolved* module, so `~/components/Loadable`,
   * `../../components/Loadable` and `./Loadable` all match the same entry.
   */
  sources?: string[];
}

/** The property injected into the options object. */
const ID_PROPERTY = 'loadableId';

/** Tried in order, mirroring how Vite resolves an extensionless specifier. */
const EXTENSIONS = ['.tsx', '.ts', '.jsx', '.js', '.mjs', '.cjs'];

const DEFAULT_SOURCES = ['@loadable/component', 'src/components/Loadable'];

const isFile = (candidate: string) => {
  try {
    return fs.statSync(candidate).isFile();
  } catch {
    return false;
  }
};

/** `./List` -> `./List.tsx`, else `./List/index.tsx`, else undefined. */
const resolveFile = (base: string) => {
  if (isFile(base)) {
    return base;
  }
  for (const ext of EXTENSIONS) {
    if (isFile(base + ext)) {
      return base + ext;
    }
  }
  for (const ext of EXTENSIONS) {
    const index = path.join(base, `index${ext}`);
    if (isFile(index)) {
      return index;
    }
  }
  return undefined;
};

export const loadableId = (
  { types: t }: { types: typeof BabelTypes },
  options: LoadableIdOptions = {}
): PluginObj => {
  const root = options.root ?? process.cwd();
  const sources = options.sources ?? DEFAULT_SOURCES;

  // Only successful resolutions are cached: a miss can become a hit when a
  // file is created during a dev session, but a hit cannot change meaning.
  const cache = new Map<string, string>();

  /**
   * The root-relative posix id for a specifier written in `importerDir`, or
   * undefined for a bare package or anything outside the root.
   */
  const resolveId = (specifier: string, importerDir: string) => {
    const key = `${importerDir}\u0000${specifier}`;
    const cached = cache.get(key);
    if (cached) {
      return cached;
    }

    let base;
    if (specifier.startsWith('./') || specifier.startsWith('../')) {
      base = path.resolve(importerDir, specifier);
    } else if (specifier.startsWith('~/')) {
      // The `~` alias points at `src`, per tsconfig `paths` and the Vite alias.
      base = path.join(root, 'src', specifier.slice(2));
    } else {
      // A bare package specifier. It has no manifest key, so there is no id
      // to inject and the call site keeps its fallback.
      return undefined;
    }

    const file = resolveFile(base);
    if (!file) {
      return undefined;
    }
    const id = path.relative(root, file).split(path.sep).join('/');
    if (id.startsWith('..')) {
      return undefined;
    }
    cache.set(key, id);
    return id;
  };

  const isLoadableSource = (specifier: string, importerDir: string) => {
    if (sources.includes(specifier)) {
      return true;
    }
    const id = resolveId(specifier, importerDir);
    return (
      id !== undefined &&
      sources.some((source) => id === source || id.startsWith(`${source}/`))
    );
  };

  /** `() => import('X')` (or a block body returning it) -> `'X'`. */
  const importedSpecifier = (arg: BabelTypes.Node | undefined) => {
    if (!t.isArrowFunctionExpression(arg) && !t.isFunctionExpression(arg)) {
      return undefined;
    }
    let returned: BabelTypes.Node | null | undefined = arg.body;
    if (t.isBlockStatement(returned)) {
      const [statement, ...rest] = returned.body;
      if (rest.length > 0 || !t.isReturnStatement(statement)) {
        return undefined;
      }
      returned = statement.argument;
    }
    if (!t.isCallExpression(returned) || !t.isImport(returned.callee)) {
      return undefined;
    }
    const [specifier] = returned.arguments;
    return t.isStringLiteral(specifier) ? specifier.value : undefined;
  };

  const hasId = (object: BabelTypes.ObjectExpression) =>
    object.properties.some(
      (property) =>
        (t.isObjectProperty(property) || t.isObjectMethod(property)) &&
        ((t.isIdentifier(property.key) && property.key.name === ID_PROPERTY) ||
          (t.isStringLiteral(property.key) &&
            property.key.value === ID_PROPERTY))
    );

  return {
    name: 'loadable-id',
    visitor: {
      Program(program, state) {
        const filename = state.filename;
        if (!filename) {
          // No importer to resolve relative specifiers against.
          return;
        }
        const importerDir = path.dirname(filename);

        // Track the *local binding* of `loadable`, since it may arrive as a
        // default or a named import and either may be aliased.
        const bindings = new Set<BabelTypes.Node>();
        for (const statement of program.node.body) {
          if (
            !t.isImportDeclaration(statement) ||
            !isLoadableSource(statement.source.value, importerDir)
          ) {
            continue;
          }
          for (const specifier of statement.specifiers) {
            if (t.isImportDefaultSpecifier(specifier)) {
              bindings.add(specifier);
            } else if (t.isImportSpecifier(specifier)) {
              const imported = specifier.imported;
              const name = t.isIdentifier(imported)
                ? imported.name
                : imported.value;
              if (name === 'loadable' || name === 'default') {
                bindings.add(specifier);
              }
            }
          }
        }
        if (bindings.size === 0) {
          return;
        }

        program.traverse({
          CallExpression(call) {
            const callee = call.node.callee;

            // `loadable(...)` or `loadable.lib(...)`.
            let name;
            if (t.isIdentifier(callee)) {
              name = callee.name;
            } else if (
              t.isMemberExpression(callee) &&
              !callee.computed &&
              t.isIdentifier(callee.object) &&
              t.isIdentifier(callee.property) &&
              callee.property.name === 'lib'
            ) {
              name = callee.object.name;
            } else {
              return;
            }
            // The binding must still be the import: a local shadow of the
            // name is not our `loadable`.
            const binding = call.scope.getBinding(name);
            if (!binding || !bindings.has(binding.path.node)) {
              return;
            }

            const specifier = importedSpecifier(call.node.arguments[0]);
            if (specifier === undefined) {
              return;
            }
            const id = resolveId(specifier, importerDir);
            if (id === undefined) {
              return;
            }

            const property = t.objectProperty(
              t.identifier(ID_PROPERTY),
              t.stringLiteral(id)
            );
            const optionsArg = call.node.arguments[1];

            if (optionsArg === undefined) {
              // `loadable(() => import('X'))` — create the options object.
              call.node.arguments.push(t.objectExpression([property]));
              return;
            }
            if (!t.isObjectExpression(optionsArg)) {
              // Options came from a variable or a spread; there is nowhere
              // safe to write, so leave it alone.
              return;
            }
            if (hasId(optionsArg)) {
              // Hand-written id wins, and this keeps the transform idempotent.
              return;
            }
            // Unshifted so a later spread can still override it.
            optionsArg.properties.unshift(property);
          },
        });
      },
    },
  };
};
