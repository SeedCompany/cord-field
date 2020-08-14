export const IMAGE_TYPES = [
  'image/bmp',
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/svg+xml',
  'image/tiff',
  'image/webp',
];

export const AUDIO_TYPES = [
  'audio/3gpp',
  'audio/3gpp2',
  'audio/aac',
  'audio/m4a',
  'audio/midi',
  'audio/mpeg',
  'audio/ogg',
  'audio/opus',
  'audio/wav',
  'audio/webm',
  'audio/x-aiff',
  'audio/x-m4a',
  'audio/x-midi',
];

export const VIDEO_TYPES = [
  'video/3gpp',
  'video/3gpp2',
  'video/mp2t',
  'video/mp4',
  'video/mpeg',
  'video/ogg',
  'video/quicktime',
  'video/webm',
  'video/x-msvideo',
];

export const DOCUMENT_TYPES = [
  'application/pdf',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/csv',
];

export const SUPPORTED_TYPES = [
  ...IMAGE_TYPES,
  ...AUDIO_TYPES,
  ...VIDEO_TYPES,
  ...DOCUMENT_TYPES,
] as const;

export type SupportedType = typeof SUPPORTED_TYPES[number];
