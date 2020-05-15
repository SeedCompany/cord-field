export interface PicsumOptions {
  width: number;
  height?: number;
  seed?: string;
  id?: number;
  grayscale?: boolean;
  blur?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  webp?: boolean;
}

export const picsumUrl = (options: PicsumOptions) => {
  const parts = [
    'https://picsum.photos/',
    options.id
      ? `id/${options.id}`
      : options.seed
      ? `seed/${options.seed}/`
      : '',
    `${options.width}`,
    options.height ? `/${options.height}` : '',
    options.webp ? `.webp` : '',
  ];
  const query = new URLSearchParams();
  if (options.grayscale) {
    query.set('grayscale', '');
  }
  if (options.blur) {
    query.set('blur', `${options.blur}`);
  }
  return parts.join('') + '?' + query.toString();
};
