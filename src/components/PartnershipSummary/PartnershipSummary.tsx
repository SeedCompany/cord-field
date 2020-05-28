import { Group } from '@material-ui/icons';
import * as React from 'react';
import { FC } from 'react';
import { MemberListSummary, MemberSummaryItem } from '../MemberListSummary';
import { picsumUrl } from '../Picture/picsum';
import { PartnershipSummaryFragment } from './PartnershipSummary.generated';
import { PartnershipItemFragment } from './PartnershpItem.generated';

export interface PartnershipSummaryProps {
  partnerships?: PartnershipSummaryFragment;
}

export const PartnershipSummary: FC<PartnershipSummaryProps> = ({
  partnerships,
}) => {
  const members = partnerships
    ? partnerships.items.map(
        (item: PartnershipItemFragment): MemberSummaryItem => {
          return {
            label: item.organization.name.value ?? '',
            avatarLetters: item.organization.avatarLetters ?? '',
            picture: picsumUrl({ seed: item.id, width: 100, height: 100 }),
          };
        }
      )
    : undefined;

  return (
    <MemberListSummary
      title="Partnership Summary"
      to="/partnership"
      members={members}
      icon={Group}
    />
  );
};
