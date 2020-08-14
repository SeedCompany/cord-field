import React, { FC } from 'react';
import { Except } from 'type-fest';
import { GQLOperations } from '../../../api';
import {
  UploadCallback,
  UploadFilesForm,
  UploadFilesFormProps,
} from '../../../components/Upload';
import { EngagementQuery } from '../Engagement.generated';
import { InternshipEngagementDetailFragment } from '../InternshipEngagement/InternshipEngagement.generated';
import { LanguageEngagementDetailFragment } from '../LanguageEngagement/LanguageEngagementDetail.generated';
import {
  useUploadInternshipEngagementGrowthPlanMutation,
  useUploadLanguageEngagementPnpMutation,
} from './UploadEngagementFiles.generated';

export type UploadEngagementFilesProps = Except<
  UploadFilesFormProps,
  'onFinalizeUpload' | 'onSubmit' | 'title'
> & {
  engagement: EngagementQuery['engagement'] | undefined;
};

export const UploadEngagementFiles: FC<UploadEngagementFilesProps> = ({
  engagement,
  ...props
}) => {
  const [uploadPnp] = useUploadLanguageEngagementPnpMutation();
  const [uploadGrowthPlan] = useUploadInternshipEngagementGrowthPlanMutation();

  const isLanguageEngagement = (
    engagement: EngagementQuery['engagement'] | undefined
  ): engagement is Omit<LanguageEngagementDetailFragment, '__typename'> & {
    __typename: 'LanguageEngagement';
  } => engagement?.__typename === 'LanguageEngagement';

  const isInternshipEngagement = (
    engagement: EngagementQuery['engagement'] | undefined
  ): engagement is Omit<InternshipEngagementDetailFragment, '__typename'> & {
    __typename: 'InternshipEngagement';
  } => engagement?.__typename === 'InternshipEngagement';

  const uploadDocument = isLanguageEngagement(engagement)
    ? uploadPnp
    : isInternshipEngagement(engagement)
    ? uploadGrowthPlan
    : undefined;

  const handleUploadCompleted: UploadCallback = async (uploadId, name) => {
    if (!uploadDocument) return;
    const documentInput = {
      uploadId,
      name,
    };
    await uploadDocument({
      variables: {
        id: engagement?.id ?? '',
        ...(isLanguageEngagement(engagement) ? { pnp: documentInput } : null),
        ...(isInternshipEngagement(engagement)
          ? { growthPlan: documentInput }
          : null),
      } as any,
      refetchQueries: [GQLOperations.Query.Engagement],
    });
  };

  return (
    <UploadFilesForm {...props} onFinalizeUpload={handleUploadCompleted} />
  );
};
