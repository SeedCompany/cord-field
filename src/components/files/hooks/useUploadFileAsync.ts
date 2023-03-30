import { CreateFileVersionInput } from '~/api/schema/schema.graphql';
import { defer, Deferred } from '../../../common/defer';
import { useUpload as useUploadContext } from '../../../components/Upload';

type UploadInfo = Pick<CreateFileVersionInput, 'uploadId' | 'name'>;

/**
 * Handles uploading the file and await the result to get the upload info.
 * Use the passed deferred to inform the upload manager that the file is saved
 * successfully or errored.
 *
 * An alternative API to {@link useUploadFiles}.
 * This returns promise with id and done fn, whereas the former requires it be
 * passed as a callback.
 *
 * @example
 * const uploadFile = useUploadFileAsync();
 * // in handler
 * const [uploadedInfo, finalize] = await uploadFile(file);
 * await mySaveFn().then(...finalize.tap);
 */
export const useUploadFileAsync = () => {
  const { addFilesToUploadQueue } = useUploadContext();

  return (async (file: File | undefined) => {
    const uploading =
      defer<[upload: UploadInfo | undefined, done: Deferred<void>]>();
    const saving = defer<void>();

    if (!file) {
      uploading.resolve([undefined, saving]);
      return await uploading;
    }

    addFilesToUploadQueue([
      {
        file,
        fileName: file.name,
        callback: async (uploadId, name) => {
          uploading.resolve([{ uploadId, name }, saving]);
          await saving;
        },
      },
    ]);

    return await uploading;
  }) as UploadFileAsyncFn;
};

interface UploadFileAsyncFn {
  (file: File): Promise<[upload: UploadInfo, done: Deferred<void>]>;
  (file: File | null | undefined): Promise<
    [upload: UploadInfo | undefined, done: Deferred<void>]
  >;
}
