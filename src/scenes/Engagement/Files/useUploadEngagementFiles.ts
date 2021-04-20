import { useMutation } from '@apollo/client';
import {
  HandleUploadCompletedFunction,
  UploadFilesConsumerFunction,
  UploadFilesConsumerInput,
  useUploadFiles,
} from '../../../components/files/hooks';
import {
  UploadInternshipEngagementGrowthPlanDocument,
  UploadInternshipEngagementGrowthPlanMutation,
  UploadLanguageEngagementPnpDocument,
  UploadLanguageEngagementPnpMutation,
} from './UploadEngagementFiles.generated';

type EngagementType = 'language' | 'internship';

export const useUploadEngagementFile = (
  engagementType: EngagementType
): UploadFilesConsumerFunction => {
  const uploadFiles = useUploadFiles();
  const MutationDocument =
    engagementType === 'language'
      ? UploadLanguageEngagementPnpDocument
      : UploadInternshipEngagementGrowthPlanDocument;
  const [uploadFile] = useMutation<
    | UploadLanguageEngagementPnpMutation
    | UploadInternshipEngagementGrowthPlanMutation
  >(MutationDocument);

  const handleUploadCompleted: HandleUploadCompletedFunction = async ({
    uploadId,
    name,
    parentId: id,
  }) => {
    await uploadFile({
      variables: {
        id,
        pnp: { uploadId, name },
        growthPlan: { uploadId, name },
      },
    });
  };

  const uploadEngagementFile = ({
    action,
    files,
    parentId,
  }: UploadFilesConsumerInput) =>
    uploadFiles({ action, files, handleUploadCompleted, parentId });

  return uploadEngagementFile;
};
