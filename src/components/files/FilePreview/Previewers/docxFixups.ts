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
