import { OutputData as RichTextData } from '@editorjs/editorjs';

const hasWordListMarkers = (text: string) => {
  return /•\t(.*)/.test(text) || /^\d+\.\s(.*)/m.test(text);
};

const isUnorderedList = (text: string) => {
  return /•\t(.*)/.test(text);
};

const isOrderedList = (text: string) => {
  return /^\d+\.\s(.*)/.test(text);
};

const createListBlock = (items: string[], style: 'unordered' | 'ordered') => {
  return {
    type: 'list',
    data: {
      style: style,
      items: items,
    },
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

export const handleMsPasteFormatting = (
  event: ClipboardEvent
): RichTextData | undefined => {
  const text = event.clipboardData?.getData('text');

  if (!text || !hasWordListMarkers(text)) {
    return undefined;
  }

  const lines = text.split('\n');
  const blocks = [];
  let listItems: string[] = [];
  let listType: 'unordered' | 'ordered' = 'unordered';
  let paragraphText = '';

  lines.forEach((line) => {
    if (!line.trim() && paragraphText) {
      blocks.push(createParagraphBlock(paragraphText));
      paragraphText = '';
    } else if (isUnorderedList(line)) {
      listType = 'unordered';
      listItems.push(line.replace(/•\t/, ''));
    } else if (isOrderedList(line)) {
      listType = 'ordered';
      listItems.push(line.replace(/^\d+\.\s/, ''));
    } else {
      if (listItems.length) {
        blocks.push(createListBlock(listItems, listType));
        listItems = [];
      }
      paragraphText += line + ' ';
    }
  });

  if (listItems.length) {
    blocks.push(createListBlock(listItems, listType));
  }

  if (paragraphText.trim()) {
    blocks.push(createParagraphBlock(paragraphText));
  }

  return {
    time: Date.now(),
    blocks: blocks,
  };
};
