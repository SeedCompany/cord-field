// ai design-alignment S3's single-PUT limit is 5 GiB (this pipeline doesn't
// do multipart yet), so this stays comfortably under that ceiling.
export const MAX_UPLOAD_FILE_SIZE_BYTES = 2 * 1024 * 1024 * 1024; // 2 GiB
export const MAX_UPLOAD_FILE_SIZE_LABEL = '2 GiB';

// ai performance Limits parallel uploads so they don't compete for the same
// bandwidth/memory and stall each other; similar to defaults used by
// comparable upload libs.
export const MAX_CONCURRENT_UPLOADS = 3;
