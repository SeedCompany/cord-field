import { makeStyles } from 'tss-react/mui';
import { PeopleJoinedIcon } from '../Icons';
import { MemberListSummary, MemberSummaryItem } from '../MemberListSummary';
import { PartnershipSummaryFragment } from './PartnershipSummary.graphql';

const useStyles = makeStyles()(() => ({
  icon: {
    fontSize: 42,
    marginTop: -8,
  },
}));

export interface PartnershipSummaryProps {
  partnerships?: PartnershipSummaryFragment;
}

export const PartnershipSummary = ({
  partnerships,
}: PartnershipSummaryProps) => {
  const members = partnerships?.items.map(
    (item): MemberSummaryItem => ({
      id: item.id,
      label: item.partner.value?.organization.value?.name.value ?? '',
      avatarLetters:
        item.partner.value?.organization.value?.avatarLetters ?? '',
    })
  );
  const { classes } = useStyles();

  return (
    <MemberListSummary
      total={partnerships?.total}
      title="Partnerships"
      to="partnerships"
      members={members}
      icon={<PeopleJoinedIcon className={classes.icon} />}
    />
  );
};
