import { useCallback } from 'react';

export const useFileNameAndExtension = () => {
  const fileNameAndExtension = useCallback((fileName: string): {
    displayName: string;
    extension: string;
  } => {
    const parts = fileName.split('.');
    const [displayName, extension] =
      parts.length > 1
        ? [parts.slice(0, -1).join('.'), parts.pop() ?? '']
        : [parts[0], ''];
    return { displayName, extension };
  }, []);
  return fileNameAndExtension;
};
