// Matches native File interface that's not in a confusing global namespace
export interface UploadFile {
  lastModified: number;
  name: string;
  size: number;
  type: string;
}
