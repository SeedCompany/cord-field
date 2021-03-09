import { Grid, makeStyles, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import React, { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import { Partner } from '../../../api';
import { useNumberFormatter } from '../../../components/Formatters';
import { ContentContainer } from '../../../components/Layout';
import { List, useListQuery } from '../../../components/List';
import { PartnerListItemCard as PartnerCard } from '../../../components/PartnerListItemCard';
import { SortButtonDialog, useSort } from '../../../components/Sort';
import { PartnersDocument } from './PartnerList.generated';
import { PartnerSortOptions } from './PartnerSortOptions';

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
  options: {
    margin: spacing(3, 0),
  },
  items: {
    cardWidth: breakpoints.values.sm,
  },
  item: {
    marginBottom: spacing(2),
  },
}));

export const PartnerList: FC = () => {
  const sort = useSort<Partner>();
  const list = useListQuery(PartnersDocument, sort.value);

  const classes = useStyles();
  const formatNumber = useNumberFormatter();

  return (
    <ContentContainer>
      <Helmet title="Partners" />
      <Typography variant="h2" paragraph>
        Partners
      </Typography>
      <Grid container spacing={1} className={classes.options}>
        <Grid item>
          <SortButtonDialog {...sort}>
            <PartnerSortOptions />
          </SortButtonDialog>
        </Grid>
      </Grid>
      <Typography variant="h3" paragraph>
        {list.data ? (
          `${formatNumber(list.data.total)} Partners`
        ) : (
          <Skeleton width="10ch" />
        )}
      </Typography>
      <List
        {...list}
        classes={{ items: classes.items }}
        renderItem={(item) => (
          <PartnerCard key={item.id} partner={item} className={classes.item} />
        )}
        renderSkeleton={(index) => (
          <PartnerCard key={index} className={classes.item} />
        )}
        skeletonCount={15}
      />
    </ContentContainer>
  );
};
