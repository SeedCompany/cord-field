export const handleMsUnorderedList = (event: ClipboardEvent) => {
  const text = event.clipboardData?.getData('text');

  // Match any line that starts with "•\t" followed by anything until the end of the line
  const matches: RegExpMatchArray | null | undefined = text?.match(/•\t(.*)/g);

  if (matches) {
    // If there are matches, prevent default actions, then create an array of strings without the "•\t" prefix
    const listItems: string[] = matches.map((item) => item.replace(/•\t/, ''));

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
  }
};
