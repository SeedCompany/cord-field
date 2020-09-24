import { makeStyles, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import React, { FC } from 'react';
import { Partner } from '../../../api';
import { useNumberFormatter } from '../../../components/Formatters';
import { ContentContainer } from '../../../components/Layout';
import { ListContainer } from '../../../components/Layout/ListContainer';
import { PartnerListItemCard } from '../../../components/PartnerListItemCard';
import { useSort } from '../../../components/Sort';
import { listOrPlaceholders } from '../../../util';
import { usePartnersQuery } from './PartnerList.generated';

const useStyles = makeStyles(({ spacing }) => ({
  options: {
    margin: spacing(3, 0),
  },
  item: {
    marginBottom: spacing(2),
  },
}));

export const PartnerList: FC = () => {
  const formatNumber = useNumberFormatter();
  const sort = useSort<Partner>();
  const { data } = usePartnersQuery({
    variables: {
      input: {
        ...sort.value,
      },
    },
  });
  const items = data?.partners.items;

  const classes = useStyles();

  return (
    <ContentContainer>
      <Typography variant="h2" paragraph>
        Partners
      </Typography>
      <Typography variant="h3" paragraph>
        {data ? (
          `${formatNumber(data.partners.total)} Partners`
        ) : (
          <Skeleton width="10ch" />
        )}
      </Typography>
      <ListContainer>
        {listOrPlaceholders(items, 15).map((item, index) => (
          <PartnerListItemCard
            key={item?.id ?? index}
            partner={item}
            className={classes.item}
          />
        ))}
      </ListContainer>
    </ContentContainer>
  );
};
