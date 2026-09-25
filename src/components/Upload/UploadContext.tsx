import { useMutation } from '@apollo/client';
import {
  createContext,
  SyntheticEvent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import { ChildrenProp } from '~/common';
import { initialState, uploadReducer } from './Reducer';
import * as actions from './Reducer/uploadActions';
import * as Types from './Reducer/uploadTypings';
import { RequestFileUploadDocument } from './Upload.graphql';
import {
  MAX_CONCURRENT_UPLOADS,
  MAX_UPLOAD_FILE_SIZE_BYTES,
  MAX_UPLOAD_FILE_SIZE_LABEL,
} from './uploadConstants';
import { UploadItems } from './UploadItems';
import { UploadManagerUIShell as UploadManager } from './UploadManagerUIShell';
import { useUploadFile } from './useUploadFile';

const initialUploadContext = {
  // eslint-disable-next-line @seedcompany/no-unused-vars
  addFilesToUploadQueue: (files: Types.FileInput[]) => {
    return;
  },
  removeCompletedUploads: () => {
    return;
  },
  isManagerOpen: false,
  // eslint-disable-next-line @seedcompany/no-unused-vars
  toggleManagerOpen: (toggleOrSetOpen?: boolean) => {
    return;
  },
};

export const UploadContext =
  createContext<typeof initialUploadContext>(initialUploadContext);
UploadContext.displayName = 'UploadContext';

export const UploadProvider = ({ children }: ChildrenProp) => {
  const [state, dispatch] = useReducer(uploadReducer, initialState);
  const [isManagerOpen, setManagerOpen] = useState(false);
  const { submittedFiles } = state;
  const [requestFileUpload] = useMutation(RequestFileUploadDocument);
  const uploadFile = useUploadFile(dispatch);

  const addFilesToUploadQueue = useCallback(
    (files: Types.FileInput[]) => {
      // Reject oversized files here, before they ever reach the GraphQL
      // requestFileUpload call or mime-type sniffing, by tagging them with
      // an error up front. They still show up in the upload manager for
      // visibility, but the queue-processing effect below skips them.
      const validatedFiles = files.map((fileInput) =>
        fileInput.file.size > MAX_UPLOAD_FILE_SIZE_BYTES
          ? {
              ...fileInput,
              error: new Error(
                `"${fileInput.fileName}" is too large to upload (max ${MAX_UPLOAD_FILE_SIZE_LABEL})`
              ),
            }
          : fileInput
      );
      dispatch({
        type: actions.FILES_SUBMITTED,
        files: validatedFiles,
      });
      setManagerOpen(true);
    },
    [setManagerOpen]
  );

  const setUploadingStatus = useCallback(
    (
      queueId: Types.UploadFile['queueId'],
      uploading: Types.UploadFile['uploading']
    ) => dispatch({ type: actions.UPLOAD_STATUS_UPDATED, queueId, uploading }),
    []
  );

  const removeUpload = useCallback((queueId: Types.UploadFile['queueId']) => {
    dispatch({ type: actions.REMOVE_UPLOAD, queueId });
  }, []);

  const removeCompletedUploads = useCallback(() => {
    dispatch({ type: actions.REMOVE_COMPLETED_UPLOADS });
  }, []);

  const handleFileAdded = useCallback(
    async (file: Types.UploadFile) => {
      const { data } = await requestFileUpload();
      const { id, url } = data?.requestFileUpload ?? { id: '', url: '' };
      if (id && url) {
        dispatch({
          type: actions.FILE_UPLOAD_REQUEST_SUCCEEDED,
          queueId: file.queueId,
          uploadId: id,
        });
        const updatedFile = {
          ...file,
          uploadId: id,
        };
        uploadFile(updatedFile, url);
      }
    },
    [requestFileUpload, uploadFile]
  );

  useEffect(() => {
    // Errored files stay flagged `uploading: true` (see FILE_UPLOAD_ERROR_OCCURRED
    // in uploadReducer.ts) so they're never picked back up as "not started" below,
    // but they're no longer actually in flight, so they must not count against
    // the concurrency cap - otherwise a run of failures would permanently occupy
    // slots and stall the rest of the queue.
    const activeCount = submittedFiles.filter(
      (file) => file.uploading && !file.completedAt && !file.error
    ).length;
    const availableSlots = MAX_CONCURRENT_UPLOADS - activeCount;
    if (availableSlots <= 0) {
      return;
    }

    const filesNotStarted = submittedFiles.filter(
      (file) => !file.uploading && !file.completedAt && !file.error
    );
    for (const file of filesNotStarted.slice(0, availableSlots)) {
      setUploadingStatus(file.queueId, true);
      void handleFileAdded(file);
    }
  }, [submittedFiles, handleFileAdded, setUploadingStatus]);

  const toggleManagerOpen = useCallback(
    (open?: boolean | SyntheticEvent) => {
      setManagerOpen((prev) => {
        const nextOpen = typeof open === 'boolean' ? open : !prev;
        if (!nextOpen) {
          removeCompletedUploads();
        }
        return nextOpen;
      });
    },
    [setManagerOpen, removeCompletedUploads]
  );

  const context = useMemo(
    () => ({
      isManagerOpen,
      toggleManagerOpen,
      addFilesToUploadQueue,
      removeCompletedUploads,
    }),
    [
      isManagerOpen,
      toggleManagerOpen,
      addFilesToUploadQueue,
      removeCompletedUploads,
    ]
  );

  return (
    <UploadContext.Provider value={context}>
      {children}
      <UploadManager open={isManagerOpen} onClose={toggleManagerOpen}>
        <UploadItems state={state} removeUpload={removeUpload} />
      </UploadManager>
    </UploadContext.Provider>
  );
};

export const useUpload = () => useContext(UploadContext);
