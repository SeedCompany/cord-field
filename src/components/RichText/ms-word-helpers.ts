import { OutputData as RichTextData } from '@editorjs/editorjs';

export const handleMsPasteFormatting = (
  event: ClipboardEvent
): RichTextData | undefined => {
  const text = event.clipboardData?.getData('text');
  // If there is no text, or the text has no list return undefined and continue native paste propagation
  if (!text || !hasWordListMarkers(text)) {
    return;
  }

  const parsedLines = text.split('\n').map((line) => {
    if (isUnorderedList(line)) {
      return { type: 'ul', text: line.replace(/•\t/, '') };
    }
    if (isOrderedList(line)) {
      return { type: 'ol', text: line.replace(/^\d+\.\s/, '') };
    }
    if (line === '\r') {
      return { type: 'break', text: line };
    }
    return { type: 'p', text: line };
  });

  const groupedLines = groupSiblingsBy(parsedLines, (line) => line.type);

  const blocks = groupedLines.map((lines) => {
    const type = lines[0]!.type;
    const textLines = lines.map((line) => line.text);

    if (type === 'ol') {
      return createListBlock(textLines, 'ordered');
    }
    if (type === 'ul') {
      return createListBlock(textLines, 'unordered');
    }
    return createParagraphBlock(textLines);
  });

  return {
    time: Date.now(),
    blocks,
  };
};

const groupSiblingsBy = <T>(items: readonly T[], by: (item: T) => unknown) =>
  items.reduce((acc: T[][], cur: T) => {
    // If it's the first item or different from the last, start a new group
    if (!acc.length || by(acc.at(-1)![0]!) !== by(cur)) {
      acc.push([cur]);
    } else {
      // Otherwise, add it to the current group
      acc.at(-1)!.push(cur);
    }
    return acc;
  }, []);

const createParagraphBlock = (text: string[]) => ({
  type: 'paragraph',
  data: {
    text: text.join(' '),
  },
});

const createListBlock = (items: string[], style: 'unordered' | 'ordered') => ({
  type: 'list',
  data: {
    style: style,
    items: items,
  },
});

const hasWordListMarkers = (text: string) =>
  isUnorderedList(text) || isOrderedList(text);

const isUnorderedList = (text: string) => /•\t(.*)/.test(text);

const isOrderedList = (text: string) => /^\d+\.\s(.*)/.test(text);
