import { OutputData as RichTextData } from '@editorjs/editorjs';

interface BlockState {
  blocks: any[];
  paragraphText: string;
  listItems: string[];
  listType: 'unordered' | 'ordered' | null;
}

const initialBlockState: BlockState = {
  blocks: [],
  paragraphText: '',
  listItems: [],
  listType: null,
};

export const handleMsPasteFormatting = (
  event: ClipboardEvent
): RichTextData | undefined => {
  const text = event.clipboardData?.getData('text');
  // If there is no text, or the text has no list return undefined and continue native paste propagation
  if (!text || !hasWordListMarkers(text)) {
    return;
  }

  const lines = text.split('\n');
  // split the text by newline character and start the reduction loop
  const blocksState: BlockState = lines.reduce(
    (acc: BlockState, line: string): BlockState => {
      // if we have a paragraph and the line is empty, create a paragraph block and reset the paragraph text
      if (!line.trim() && acc.paragraphText) {
        return {
          ...acc,
          blocks: [...acc.blocks, createParagraphBlock(acc.paragraphText)],
          paragraphText: '',
        };
        // if we have an unordered list item add it to the list items array from which the block will be constructed
      } else if (isUnorderedList(line)) {
        return {
          ...acc,
          listType: 'unordered',
          listItems: [...acc.listItems, line.replace(/•\t/, '')],
        };
        // Same thing here but for an ordered list
      } else if (isOrderedList(line)) {
        return {
          ...acc,
          listType: 'ordered',
          listItems: [...acc.listItems, line.replace(/^\d+\.\s/, '')],
        };
        // if we have a completed list build the block and reset the list items array
      } else if (acc.listItems.length) {
        return {
          listType: acc.listType,
          listItems: [],
          blocks: [...acc.blocks, createListBlock(acc.listItems, acc.listType)],
          paragraphText: acc.paragraphText + line + ' ',
        };
        // Otherwise just add the line to the paragraph text
      } else {
        return {
          ...acc,
          paragraphText: acc.paragraphText + line + ' ',
        };
      }
    },
    initialBlockState
  );

  return {
    time: Date.now(),
    blocks: blocksState.blocks,
  };
};

const createParagraphBlock = (text: string) => {
  return {
    type: 'paragraph',
    data: {
      text: text.trim(),
    },
  };
};

const createListBlock = (
  items: string[],
  style: 'unordered' | 'ordered' | null
) => {
  return {
    type: 'list',
    data: {
      style: style,
      items: items,
    },
  };
};

const hasWordListMarkers = (text: string) => {
  return isUnorderedList(text) || isOrderedList(text);
};

const isUnorderedList = (text: string) => {
  return /•\t(.*)/.test(text);
};

const isOrderedList = (text: string) => {
  return /^\d+\.\s(.*)/.test(text);
};
