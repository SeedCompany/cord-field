import { OutputData as RichTextData } from '@editorjs/editorjs';

export const handleMsUnorderedList = (
  event: ClipboardEvent
): RichTextData | undefined => {
  const text = event.clipboardData?.getData('text');

  // Match any line that starts with "•\t" followed by anything until the end of the line
  const matches = text?.match(/•\t(.*)/g);

  if (!matches) {
    return undefined;
  }
  // If there are matches, prevent default actions, then create an array of strings without the "•\t" prefix
  const listItems = matches.map((item) => item.replace(/•\t/, ''));

  // Now create a new object that conforms to the structure of RichTextData
  // Assumption is that all the list items should be part of a single unordered list
  return {
    time: Date.now(),
    blocks: [
      {
        type: 'list',
        data: {
          style: 'unordered',
          items: listItems,
        },
      },
    ],
  };
};
