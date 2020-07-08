export const useFileSizeFormatter = () => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) {
      return `${bytes} ${sizes[0]}`;
    }
    const sizeIndex = Number(Math.floor(Math.log(bytes) / Math.log(1024)));
    return `${Math.round(bytes / Math.pow(1024, sizeIndex))} ${
      sizes[sizeIndex]
    }`;
  };
  return formatFileSize;
};
