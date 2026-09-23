import { createContext, ReactElement } from 'react';

/**
 * Records which loadable ids were rendered during a server request, so the
 * page can tell the client which chunks it will need.
 *
 * Shaped like {@link import('../Routing').ServerLocation} — construct one per
 * request and add its `wrap` to `renderServerSideApp`'s render chain.
 *
 * Unlike `ServerLocation`, this deliberately does **not** reset in `wrap`.
 * Apollo's `getMarkupFromTree` renders the tree repeatedly, and a later pass
 * can render fewer loadables than an earlier one (a query resolves and a
 * branch changes). Over-collecting costs one wasted preload hint;
 * under-collecting costs a request waterfall on first paint. So ids
 * accumulate across every pass.
 */
export class ChunkCollector {
  private readonly ids = new Set<string>();

  wrap(el: ReactElement) {
    return (
      <ChunkCollectorContext.Provider value={this}>
        {el}
      </ChunkCollectorContext.Provider>
    );
  }

  /** Called by loadable components as they render. */
  add(id: string) {
    this.ids.add(id);
  }

  /** The ids rendered so far, in first-rendered order. */
  get chunkIds(): string[] {
    return [...this.ids];
  }
}

export const ChunkCollectorContext = createContext<ChunkCollector | undefined>(
  undefined
);
