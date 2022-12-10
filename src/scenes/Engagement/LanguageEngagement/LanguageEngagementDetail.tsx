import { Add } from '@mui/icons-material';
import { Card, Grid, Tooltip, Typography } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { Many } from '~/common';
import { DataButton } from '~/components/DataButton';
import { useDialog } from '~/components/Dialog';
import { Fab } from '../../../components/Fab';
import { ResponsiveDivider } from '../../../components/ResponsiveDivider';
import { Link } from '../../../components/Routing';
import {
  EditableProjectField,
  UpdateProjectDialog,
} from '../../../scenes/Projects/Update';
import { ProductList } from '../../Products/List/ProductList';
import { EngagementQuery } from '../Engagement.graphql';
import { CeremonyForm } from './Ceremony';
import { DatesForm } from './DatesForm';
import { LanguageEngagementHeader } from './Header';
import { PlanningSpreadsheet, ProgressReports } from './ProgressAndPlanning';

const useStyles = makeStyles()(({ spacing, breakpoints }) => ({
  root: {
    flex: 1,
    overflowY: 'auto',
    padding: spacing(4),
  },
  main: {
    maxWidth: breakpoints.values.lg,
  },
  details: {
    // 900px is the min width that the periodic report and progress card look
    // good on the same row
    [breakpoints.between(900, 'md')]: {
      // Grid=6 (half)
      flexGrow: 0,
      maxWidth: '50%',
      flexBasis: '50%',
    },
  },
  detailsCard: {
    flex: 1,
    padding: spacing(3, 2, 1),
    display: 'flex',
    flexWrap: 'wrap',
    alignContent: 'flex-end',
  },
}));

export const LanguageEngagementDetail = ({ engagement }: EngagementQuery) => {
  const { classes } = useStyles();

  const [editState, editField, fieldsBeingEdited] =
    useDialog<Many<EditableProjectField>>();

  if (engagement.__typename !== 'LanguageEngagement') {
    return null; // easiest for typescript
  }

  const primaryLocation = engagement.project.primaryLocation;
  const region = engagement.project.fieldRegion;
  const locations = {
    canRead: (primaryLocation.canRead || region.canRead) ?? false,
    canEdit: (primaryLocation.canEdit || region.canEdit) ?? false,
    value:
      /**
       * A lot going on here. Obviously if both values exist, we'll show
       * them. If neither value exists, we want to pass the `DataButton`
       * `undefined`, and then we just use the `empty` prop of the
       * `DataButton` to display whatever message deem appropriate.
       *
       * But if only one value exists, we still want to display "Enter XX"
       * in the place where the other value **would** be—BUT ONLY if the
       * user has edit rights, otherwise they'll just be annoyed that we
       * prompted them to "Enter XX" when really they're not allowed.
       */
      !primaryLocation.value && !region.value
        ? undefined
        : `${
            primaryLocation.value?.name.value ??
            (primaryLocation.canEdit ? 'Enter Location' : '')
          }${
            (primaryLocation.value && region.value) ||
            (primaryLocation.canEdit && region.value) ||
            (primaryLocation.value && region.canEdit) ||
            (primaryLocation.canEdit && region.canEdit)
              ? ' | '
              : ''
          }${
            region.value?.name.value ?? (region.canEdit ? 'Enter Region' : '')
          }`,
  };

  console.log(engagement);

  return (
    <div className={classes.root}>
      <Grid
        component="main"
        container
        direction="column"
        spacing={3}
        className={classes.main}
      >
        <LanguageEngagementHeader engagement={engagement} />
        <Grid item container spacing={5}>
          <Grid item lg={5} container direction="column" spacing={3}>
            <Grid item container spacing={3}>
              <Grid item container className={classes.details}>
                <ProgressReports engagement={engagement} />
              </Grid>
              <Grid item container className={classes.details}>
                <PlanningSpreadsheet engagement={engagement} />
              </Grid>
            </Grid>
            <Grid item container spacing={3}>
              <Grid item container className={classes.details}>
                <Card className={classes.detailsCard}>
                  <CeremonyForm ceremony={engagement.ceremony} />
                </Card>
              </Grid>
              <Grid item container className={classes.details}>
                <Card className={classes.detailsCard}>
                  <Typography variant="h4" gutterBottom>
                    Translation Details
                  </Typography>
                  <DatesForm engagement={engagement} />
                </Card>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={12} lg="auto" container>
            <ResponsiveDivider vertical="lgUp" />
          </Grid>
          <Grid
            item
            xs={12}
            md={12}
            lg
            container
            direction="column"
            spacing={2}
          >
            <Grid item>
              <DataButton
                loading={!engagement.project}
                secured={locations}
                empty="Enter Location | Field Region"
                redacted="You do not have permission to view location"
                children={locations.value}
                onClick={() =>
                  editField([
                    'marketingLocationId',
                    //TODO: 'marketingRegionId', // this needs the marketing region lookup but it's not in the project fragment.
                  ])
                }
              />
            </Grid>
            <Grid item container spacing={2} alignItems="center">
              <Grid item component={Typography} variant="h3" paragraph>
                Goals
              </Grid>
              <Grid item>
                <Tooltip title="Create Goal">
                  <Fab
                    // @ts-expect-error it works. These generics are hard to express.
                    component={Link}
                    to="./products/create"
                    color="error"
                    size="small"
                  >
                    <Add />
                  </Fab>
                </Tooltip>
              </Grid>
            </Grid>
            <Grid item container>
              <ProductList engagement={engagement} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <UpdateProjectDialog
        {...editState}
        project={engagement.project}
        editFields={fieldsBeingEdited}
      />
    </div>
  );
};
