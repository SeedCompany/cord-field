import { useMutation } from '@apollo/client';
import { getErrorInfo, isErrorCode } from '../../../api';
import { CalendarDate } from '../../../util';
import { useUploadFiles } from '../../files/hooks';
import { UpdatePeriodicReportDocument } from './UpdatePeriodicReport.graphql';

export const useUpdatePeriodicReport = () => {
  const uploadFiles = useUploadFiles();
  const [uploadFile] = useMutation(UpdatePeriodicReportDocument);

  return async (
    id: string,
    files?: File[],
    receivedDate?: CalendarDate,
    skippedReason?: string | null
  ) => {
    const updateReport = async (uploadId?: string, name?: string) => {
      await uploadFile({
        variables: {
          input: {
            id,
            ...(uploadId ? { reportFile: { uploadId, name } } : {}),
            receivedDate,
            skippedReason,
          },
          refreshFromPnp: !!uploadId,
        },
        onError: (err) => {
          const info = getErrorInfo(err);
          if (!isErrorCode(info, 'StepNotPlanned')) {
            return;
          }
          // queue snack bar, maybe fetch product label
        },
      });
    };
    if (id) {
      if (files) {
        uploadFiles({
          files,
          handleUploadCompleted: async ({ uploadId, name }) => {
            await updateReport(uploadId, name);
          },
          parentId: id,
        });
      } else {
        await updateReport();
      }
    }
  };
};
