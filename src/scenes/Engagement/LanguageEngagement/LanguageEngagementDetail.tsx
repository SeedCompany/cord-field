import {
  Breadcrumbs,
  Grid,
  makeStyles,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { ChatOutlined, Edit } from '@material-ui/icons';
import React, { FC } from 'react';
import { canEditAny } from '../../../api';
import { AddItemCard } from '../../../components/AddItemCard';
import { BooleanProperty } from '../../../components/BooleanProperty';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { DataButton } from '../../../components/DataButton';
import { DefinedFileCard } from '../../../components/DefinedFileCard';
import { useDialog } from '../../../components/Dialog';
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
import { Link } from '../../../components/Routing';
import { Many } from '../../../util';
import { CeremonyCard } from '../CeremonyCard';
import {
  EditableEngagementField,
  EditEngagementDialog,
} from '../EditEngagement/EditEngagementDialog';
import { EngagementQuery } from '../Engagement.generated';
import { useUploadEngagementFile } from '../Files';

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
  const uploadFile = useUploadEngagementFile('language');

  const [editState, show, editField] = useDialog<
    Many<EditableEngagementField>
  >();

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
          <Grid item container spacing={3} alignItems="center">
            <Grid item className={langName ? undefined : classes.nameRedacted}>
              <Typography
                variant="h2"
                {...(language
                  ? { component: Link, to: `/languages/${language.id}` }
                  : {})}
              >
                {langName ?? (
                  <Redacted
                    info={`You do not have permission to view this engagement's ${
                      language ? 'name' : 'language'
                    }`}
                    width="100%"
                  />
                )}
              </Typography>
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
                  value: formatDate(
                    engagement.communicationsCompleteDate.value
                  ),
                }}
                icon={ChatOutlined}
                onClick={() => show('communicationsCompleteDate')}
                onButtonClick={() => show('communicationsCompleteDate')}
                emptyValue="None"
              />
            </Grid>
            <Grid item container spacing={3} alignItems="center">
              <Grid item xs={6}>
                {pnp.canRead && !pnp.value ? (
                  <AddItemCard
                    actionType="dropzone"
                    canAdd={pnp.canEdit}
                    handleFileSelect={(files: File[]) =>
                      uploadFile({ files, parentId: engagement.id })
                    }
                    DropzoneProps={{
                      options: {
                        multiple: false,
                      },
                    }}
                    itemType="Planning and Progress"
                  />
                ) : (
                  <DefinedFileCard
                    onVersionUpload={(files) =>
                      uploadFile({
                        action: 'version',
                        files,
                        parentId: engagement.id,
                      })
                    }
                    resourceType="engagement"
                    securedFile={engagement.pnp}
                  />
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
  <FileActionsContextProvider>
    <LanguageEngagementDetailWrapped {...props} />
  </FileActionsContextProvider>
);
