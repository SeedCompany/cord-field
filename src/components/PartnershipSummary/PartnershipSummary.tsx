import { Group } from '@material-ui/icons';
import * as React from 'react';
import { FC } from 'react';
import { MemberListSummary, MemberSummaryItem } from '../MemberListSummary';
import { PartnershipSummaryFragment } from './PartnershipSummary.generated';

export interface PartnershipSummaryProps {
  partnerships?: PartnershipSummaryFragment;
}

export const PartnershipSummary: FC<PartnershipSummaryProps> = ({
  partnerships,
}) => {
  const members = partnerships?.items.map(
    (item): MemberSummaryItem => ({
      label: item.organization.name.value ?? '',
      avatarLetters: item.organization.avatarLetters ?? '',
    })
  );

  return (
    <MemberListSummary
      title="Partners"
      to="partnerships"
      members={members}
      icon={Group}
    />
  );
};
