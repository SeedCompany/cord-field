/**
 * Corrections applied around docx-preview where its output differs from Word
 * in ways our reports hit. Each works on the library's parsed model or its
 * rendered DOM, so the library itself stays unpatched.
 */

interface NumberingPart {
  /** Each `w:num`, with any level overrides it declares. */
  numberings: Array<{
    id: string;
    overrides: Array<{ level: number; start?: number }>;
  }>;
  /** The flattened levels the renderer builds its CSS counters from. */
  domNumberings: Array<{ id: string; level: number; start: number }>;
}

/**
 * Honor `w:startOverride`. Word restarts a list's numbering through it (an
 * item pasted or edited separately often gets its own `w:num` starting at 2,
 * then 3), and docx-preview ignores it, so such lists render as 1, 1, 1.
 */
export const applyNumberingStartOverrides = (document: {
  numberingPart?: NumberingPart;
}) => {
  const part = document.numberingPart;
  if (!part) {
    return;
  }
  for (const numbering of part.numberings) {
    for (const override of numbering.overrides) {
      if (override.start === undefined) {
        continue;
      }
      const level = part.domNumberings.find(
        (dom) => dom.id === numbering.id && dom.level === override.level
      );
      if (level) {
        level.start = override.start;
      }
    }
  }
};

/**
 * A cell whose shading is `auto` has no fill in Word, even inside a table
 * that is shaded as a whole. docx-preview renders it as `inherit`, which
 * lets the table's color through. Paint those cells the paper color instead.
 */
export const clearAutoCellShading = (nodes: Node[]) => {
  for (const node of nodes) {
    if (!(node instanceof Element)) {
      continue;
    }
    for (const cell of node.querySelectorAll<HTMLElement>('td')) {
      if (cell.style.backgroundColor !== 'inherit') {
        continue;
      }
      const table = cell.closest<HTMLElement>('table');
      cell.style.backgroundColor = table?.style.backgroundColor
        ? 'white'
        : 'transparent';
    }
  }
};

const markerProperties = [
  'font-family',
  'font-size',
  'font-weight',
  'font-style',
  'color',
];

/**
 * Word formats a list number like the paragraph mark, which carries the
 * paragraph style's run formatting. docx-preview puts all run formatting on
 * the `span`s and draws the number as a `::before` on the bare `p`, so the
 * number inherits the app's own font and color instead and looks out of
 * place. For every `… span` rule the renderer emitted, add the same typography
 * for `…:before`, ahead of the numbering rules so a level's own font still wins.
 */
export const formatNumbersLikeText = (nodes: Node[]) => {
  const numberingIndex = nodes.findIndex(
    (node) =>
      node.nodeType === Node.COMMENT_NODE &&
      (node.textContent ?? '').includes('numbering styles')
  );
  if (numberingIndex < 0) {
    return;
  }
  const companions = nodes
    .slice(0, numberingIndex)
    .filter((node): node is HTMLStyleElement => node.nodeName === 'STYLE')
    .flatMap((style) => companionRules(style.textContent));
  if (companions.length === 0) {
    return;
  }
  const style = document.createElement('style');
  style.textContent = companions.join('\n');
  nodes.splice(numberingIndex, 0, style);
};

const companionRules = (css: string) =>
  css.split('}').flatMap((rule) => {
    const [selectors, body] = rule.split('{');
    if (!selectors || !body) {
      return [];
    }
    const targets = selectors
      .split(',')
      .map((selector) => selector.trim())
      .filter((selector) => selector.endsWith(' span'))
      .map((selector) => {
        const parent = selector.slice(0, -' span'.length);
        // The number is a `::before` of the `p`: a `.docx span` default
        // becomes `.docx p:before`, a `p.docx_x span` just `p.docx_x:before`.
        return /(^|\s)p(\.[\w-]+)*$/.test(parent)
          ? `${parent}:before`
          : `${parent} p:before`;
      });
    const declarations = body
      .split(';')
      .map((declaration) => declaration.trim())
      .filter((declaration) =>
        markerProperties.includes(declaration.split(':')[0]!.trim())
      );
    return targets.length && declarations.length
      ? [`${targets.join(', ')} { ${declarations.join('; ')}; }`]
      : [];
  });
