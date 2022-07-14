import baseEmotionCache from '@emotion/cache';
import { prefixer } from 'stylis';

const stylisPlugins = [
  // Add prefixer in production, but don't add clutter in dev
  ...(process.env.NODE_ENV === 'production' ? [prefixer] : []),
];

export const createMuiEmotionCache = () =>
  baseEmotionCache({
    key: 'mui',
    prepend: true,
    stylisPlugins,
  });

export const createTssEmotionCache = () =>
  baseEmotionCache({
    key: 'tss',
    stylisPlugins,
  });
