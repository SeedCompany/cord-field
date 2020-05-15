import { PicsumOptions, picsumUrl } from './picsum';

export const useRandomPicture = (options: PicsumOptions) => ({
  width: options.width,
  height: options.height,
  source: picsumUrl(options),
});
