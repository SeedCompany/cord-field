// S3's single-PUT upload (what this pipeline uses - see useUploadFile.ts)
// has a hard 5 GiB ceiling; anything larger requires multipart upload, which
// requestFileUpload doesn't support yet. This default stays well under that
// ceiling while still covering the largest files this app expects (media
// attachments on progress reports). Revisit alongside any backend/API
// gateway limits if those are introduced later.
export const MAX_UPLOAD_FILE_SIZE_BYTES = 2 * 1024 * 1024 * 1024; // 2 GiB
export const MAX_UPLOAD_FILE_SIZE_LABEL = '2 GB';

// Caps how many files upload in parallel. Browsers already limit outgoing
// connections per origin (historically ~6 in Chrome/Firefox), and running
// every queued upload at once competes for the same bandwidth and memory
// budget, stalling progress for all of them at large batch sizes. 3 mirrors
// the concurrency default used by comparable upload libraries (e.g. Fine
// Uploader) as a reasonable balance of throughput vs. resource usage.
export const MAX_CONCURRENT_UPLOADS = 3;
