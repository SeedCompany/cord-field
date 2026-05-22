import { useMutation } from '@apollo/client';
import { Edit } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { getErrorInfo, isErrorCode } from '~/api';
import { ProductStepLabels } from '~/api/schema.graphql';
import { CalendarDateOrISO } from '~/common';
import { useUploadFiles } from '../../files/hooks';
import { IconButton } from '../../IconButton';
import { Link, useNavigate } from '../../Routing';
import { dateFieldFor, PeriodicReportFileField } from '../fileField';
import {
  ProductLabelDocument,
  UpdatePeriodicReportDocument,
} from './UpdatePeriodicReport.graphql';

export const useUpdatePeriodicReport = (
  fileField: PeriodicReportFileField = 'reportFile'
) => {
  const uploadFiles = useUploadFiles();
  const [updatePeriodicReport, { client }] = useMutation(
    UpdatePeriodicReportDocument
  );
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const dateField = dateFieldFor(fileField);
  const isPnp = fileField === 'reportFile';

  return async (
    id: string,
    files?: File[],
    receivedDate?: CalendarDateOrISO | null,
    skippedReason?: string | null
  ) => {
    const updateReport = async (uploadId?: string, name?: string) => {
      await updatePeriodicReport({
        variables: {
          input: {
            id,
            ...(uploadId && name
              ? { [fileField]: { upload: uploadId, name } }
              : {}),
            [dateField]: receivedDate,
            skippedReason,
          },
          refreshFromPnp: isPnp && !!uploadId,
        },
        onError: isPnp
          ? (err) => {
              const showError = async () => {
                const info = getErrorInfo(err);
                if (!isErrorCode(info, 'StepNotPlanned')) {
                  return;
                }

                const productInfo = await client.query({
                  query: ProductLabelDocument,
                  variables: { id: info.productId },
                });

                enqueueSnackbar(
                  <>
                    <i>{ProductStepLabels[info.step]}</i>&nbsp;step is not
                    planned for goal&nbsp;
                    <Link to={`/products/${info.productId}`} color="inherit">
                      {productInfo.data.product.label}
                    </Link>
                  </>,
                  {
                    action: (key) => (
                      <IconButton
                        color="inherit"
                        onClick={() => {
                          closeSnackbar(key);
                          navigate(`/products/${info.productId}/edit`);
                        }}
                      >
                        <Edit />
                      </IconButton>
                    ),
                    autoHideDuration: 15_000,
                    variant: 'error',
                  }
                );
              };
              void showError();
              throw err;
            }
          : undefined,
      });
    };
    if (!id) return;
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
  };
};
