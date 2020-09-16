import { useMutation } from '@apollo/client';
import {
  HandleUploadCompletedFunction,
  UploadFilesConsumerFunction,
  UploadFilesConsumerInput,
  useUploadFiles,
} from '../../../components/files/hooks';
import { updateCachedVersions } from '../../../components/files/updateCachedVersions';
import {
  UploadInternshipEngagementGrowthPlanDocument,
  UploadInternshipEngagementGrowthPlanMutation,
  UploadLanguageEngagementPnpDocument,
  UploadLanguageEngagementPnpMutation,
} from './UploadEngagementFiles.generated';

type EngagementType = 'language' | 'internship';

const isLanguageEngagementMutation = (
  data:
    | UploadInternshipEngagementGrowthPlanMutation
    | UploadLanguageEngagementPnpMutation
): data is UploadLanguageEngagementPnpMutation =>
  'updateLanguageEngagement' in data;

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
    action,
  }) => {
    await uploadFile({
      variables: {
        id,
        pnp: { uploadId, name },
        growthPlan: { uploadId, name },
      },
      update:
        action !== 'version'
          ? undefined
          : (cache, { data }) => {
              if (data) {
                if (isLanguageEngagementMutation(data)) {
                  const pnp =
                    data.updateLanguageEngagement.engagement.pnp.value;
                  if (pnp) {
                    console.log('pnp', pnp);
                    const existingVersions = pnp.children.items;
                    updateCachedVersions(cache, existingVersions, pnp.id);
                  }
                } else {
                  const growthPlan =
                    data.updateInternshipEngagement.engagement.growthPlan.value;
                  if (growthPlan) {
                    const existingVersions = growthPlan.children.items;
                    updateCachedVersions(
                      cache,
                      existingVersions,
                      growthPlan.id
                    );
                  }
                }
              }
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
