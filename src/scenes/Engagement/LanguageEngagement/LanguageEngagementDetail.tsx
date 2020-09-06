import {
  Breadcrumbs,
  Grid,
  makeStyles,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { ChatOutlined, DateRange, Edit } from '@material-ui/icons';
import React, { FC } from 'react';
import {
  canEditAny,
  displayEngagementStatus,
  securedDateRange,
} from '../../../api';
import { AddItemCard } from '../../../components/AddItemCard';
import { BooleanProperty } from '../../../components/BooleanProperty';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { DataButton } from '../../../components/DataButton';
import { useDialog } from '../../../components/Dialog';
import { EngagementFileCard } from '../../../components/EngagementFileCard';
import { Fab } from '../../../components/Fab';
import { FieldOverviewCard } from '../../../components/FieldOverviewCard';
import { FileActionsContextProvider } from '../../../components/files/FileActions';
import {
  useDateFormatter,
  useDateTimeFormatter,
} from '../../../components/Formatters';
import { OptionsIcon, PlantIcon } from '../../../components/Icons';
import { AddProductCard, ProductCard } from '../../../components/ProductCard';
import { ProjectBreadcrumb } from '../../../components/ProjectBreadcrumb';
import { Redacted } from '../../../components/Redacted';
import { Many } from '../../../util';
import { CeremonyCard } from '../CeremonyCard';
import {
  EditableEngagementField,
  EditEngagementDialog,
} from '../EditEngagement/EditEngagementDialog';
import { EngagementQuery } from '../Engagement.generated';
import { useUploadEngagementFiles } from '../Files';

const useStyles = makeStyles(({ spacing, breakpoints, palette }) => ({
  root: {
    flex: 1,
    overflowY: 'auto',
    padding: spacing(4),
  },
  main: {
    maxWidth: breakpoints.values.md,
  },
  nameRedacted: {
    width: '50%',
  },
  infoColor: {
    color: palette.info.main,
  },
}));

const LanguageEngagementDetailWrapped: FC<EngagementQuery> = ({
  project,
  engagement,
}) => {
  const classes = useStyles();
  const uploadFile = useUploadEngagementFiles('language');

  const [editState, show, editField] = useDialog<
    Many<EditableEngagementField>
  >();

  const date = securedDateRange(engagement.startDate, engagement.endDate);
  const formatDate = useDateFormatter();
  const formatDateTime = useDateTimeFormatter();

  if (engagement.__typename !== 'LanguageEngagement') {
    return null; // easiest for typescript
  }

  const language = engagement.language.value;
  const langName = language?.name.value ?? language?.displayName.value;
  const ptRegistryId = engagement.paraTextRegistryId;
  const pnp = engagement.pnp;
  const editable = canEditAny(engagement);

  return (
    <>
      <div className={classes.root}>
        <Grid
          component="main"
          container
          direction="column"
          spacing={3}
          className={classes.main}
        >
          <Grid item>
            <Breadcrumbs>
              <ProjectBreadcrumb data={project} />
              {langName ? (
                <Breadcrumb to=".">{langName}</Breadcrumb>
              ) : (
                <Redacted
                  info="You do not have permission to view this engagement's name"
                  width={200}
                />
              )}
            </Breadcrumbs>
          </Grid>
          {editable && (
            <Grid item>
              <Tooltip title="Update First Scripture and Luke Partnership">
                <Fab
                  color="primary"
                  aria-label="Update language engagement"
                  onClick={() => show(['firstScripture', 'lukePartnership'])}
                >
                  <Edit />
                </Fab>
              </Tooltip>
            </Grid>
          )}
        </Grid>
        <Grid item container spacing={3} alignItems="center">
          <Grid item>
            <Typography variant="h4">Language Engagement</Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2" color="textSecondary">
              Updated {formatDateTime(engagement.modifiedAt)}
            </Typography>
          </Grid>
        </Grid>
        <Grid item container spacing={1} alignItems="center">
          <Grid item>
            <DataButton
              startIcon={<DateRange className={classes.infoColor} />}
              secured={date}
              redacted="You do not have permission to view start/end dates"
              children={formatDate.range}
              empty="Start - End"
              onClick={() => show(['startDateOverride', 'endDateOverride'])}
            />
          </Grid>
          <Grid item>
            <DataButton onClick={() => show('status')}>
              {displayEngagementStatus(engagement.status)}
            </DataButton>
          </Grid>
          <Grid item>
            <DataButton
              onClick={() => show(['paraTextRegistryId'])}
              secured={ptRegistryId}
              redacted="You do not have permission to view ParaText Registry ID"
              children={`ParaText Registry ID${
                ptRegistryId.value ? `: ${ptRegistryId.value}` : ''
              }`}
            />
          </Grid>
          <BooleanProperty
            label="First Scripture"
            redacted="You do not have permission to view whether this engagement is the first scripture for this language"
            data={engagement.firstScripture}
            wrap={(node) => <Grid item>{node}</Grid>}
          />
          <BooleanProperty
            label="Luke Partnership"
            redacted="You do not have permission to view whether this engagement is a luke partnership"
            data={engagement.lukePartnership}
            wrap={(node) => <Grid item>{node}</Grid>}
          />
        </Grid>
        <Grid item container spacing={3}>
          <Grid item xs={6}>
            <FieldOverviewCard
              title="Translation Complete Date"
              data={{
                value: formatDate(engagement.completeDate.value),
              }}
              icon={PlantIcon}
              onClick={() => show('completeDate')}
              onButtonClick={() => show('completeDate')}
              emptyValue="None"
            />
          </Grid>
          <Grid item xs={6}>
            <FieldOverviewCard
              title="Disbursement Complete Date"
              data={{
                value: formatDate(engagement.disbursementCompleteDate.value),
              }}
              icon={OptionsIcon}
              onClick={() => show('disbursementCompleteDate')}
              onButtonClick={() => show('disbursementCompleteDate')}
              emptyValue="None"
            />
          </Grid>
          <Grid item xs={6}>
            <FieldOverviewCard
              title="Communications Complete Date"
              data={{
                value: formatDate(engagement.communicationsCompleteDate.value),
              }}
              icon={ChatOutlined}
              onClick={() => show('communicationsCompleteDate')}
              onButtonClick={() => show('communicationsCompleteDate')}
              emptyValue="None"
            />
          </Grid>
          <Grid item container spacing={3} alignItems="center">
            <Grid item xs={6}>
              <Typography variant="h4">PNP</Typography>
            </Grid>
          </Grid>
          <Grid item container spacing={3} alignItems="center">
            <Grid item xs={6}>
              {pnp.canRead && !pnp.value ? (
                <AddItemCard
                  actionType="dropzone"
                  canAdd={pnp.canEdit}
                  handleFileSelect={(files: File[]) =>
                    uploadFile({ files, engagementId: engagement.id })
                  }
                  itemType="PNP"
                />
              ) : (
                <EngagementFileCard engagement={engagement} />
              )}
            </Grid>
          </Grid>
        </Grid>
        <Grid item container spacing={3} alignItems="center">
          <Grid item xs={6}>
            <CeremonyCard {...engagement.ceremony} />
          </Grid>
        </Grid>
        <Grid item>
          <Typography variant="h3" paragraph>
            Products
          </Typography>
          {engagement.products.canRead ? (
            <Grid container spacing={3}>
              {engagement.products.items.map((product) => (
                <Grid item xs={4} key={product.id}>
                  <ProductCard product={product} />
                </Grid>
              ))}
              {engagement.products.canCreate && (
                <Grid item xs={4}>
                  <AddProductCard />
                </Grid>
              )}
            </Grid>
          ) : (
            <Typography color="textSecondary">
              You don't have permission to see this engagement's products
            </Typography>
          )}
        </Grid>
      </div>
      <EditEngagementDialog
        {...editState}
        engagement={engagement}
        editFields={editField}
      />
    </>
  );
};

export const LanguageEngagementDetail: FC<EngagementQuery> = (props) => (
  <FileActionsContextProvider context="engagement">
    <LanguageEngagementDetailWrapped {...props} />
  </FileActionsContextProvider>
);
