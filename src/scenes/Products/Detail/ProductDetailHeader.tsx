import { Edit } from '@mui/icons-material';
import {
  Breadcrumbs,
  Grid,
  Skeleton,
  Tooltip,
  Typography,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { makeStyles } from 'tss-react/mui';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { EngagementBreadcrumb } from '../../../components/EngagementBreadcrumb';
import { ProjectBreadcrumb } from '../../../components/ProjectBreadcrumb';
import { Redacted } from '../../../components/Redacted';
import { FabLink } from '../../../components/Routing';
import { ProductDetailFragment as Product } from './ProductDetail.graphql';

const useStyles = makeStyles()(() => ({
  nameRedacted: {
    width: '50%',
  },
}));

export const ProductDetailHeader = ({ product }: { product?: Product }) => {
  const { classes } = useStyles();

  const language = product?.engagement.language.value;
  const langName = language?.name.value ?? language?.displayName.value;
  const project = product?.engagement.project;

  return (
    <>
      <Helmet
        title={`${product?.label ?? 'Goal'} - ${langName ?? 'A Language'}`}
      />
      <Grid item>
        <Breadcrumbs>
          <ProjectBreadcrumb data={project} />
          <EngagementBreadcrumb data={product?.engagement} />
          <Breadcrumb to=".">Goal</Breadcrumb>
        </Breadcrumbs>
      </Grid>
      <Grid item>
        <Grid container spacing={3} alignItems="center">
          <Grid
            item
            className={product?.label ? undefined : classes.nameRedacted}
          >
            <Typography variant="h2">
              {product?.label ?? (
                <Redacted
                  info={`You do not have permission to view this product's label`}
                  width="100%"
                />
              )}
            </Typography>
          </Grid>
          <Grid item>
            <Tooltip title="Edit Goal">
              <FabLink color="primary" to="edit">
                <Edit />
              </FabLink>
            </Tooltip>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Typography variant="h4">
          {product ? (
            <>Goal {product.category ? ` - ${product.category}` : ''}</>
          ) : (
            <Skeleton width="25%" />
          )}
        </Typography>
      </Grid>
    </>
  );
};
