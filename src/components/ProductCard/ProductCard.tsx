import {
  DescriptionOutlined,
  FilterVintage,
  HelpOutlined,
  MenuBook,
  Movie,
  SvgIconComponent,
} from '@mui/icons-material';
import { Card, CardContent, Grid, Typography } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { idForUrl } from '../Changeset';
import { HugeIcon } from '../Icons';
import { CardActionAreaLink } from '../Routing';
import { ProductCardFragment } from './ProductCard.graphql';

const useStyles = makeStyles()(() => ({
  root: {
    display: 'flex',
    flex: 1,
  },
  actionArea: {
    flex: 1,
  },
  icon: {
    fontSize: 80,
  },
}));

interface ProductCardProps {
  product: ProductCardFragment;
  className?: string;
}

const iconMap: Record<string, SvgIconComponent> = {
  Scripture: MenuBook,
  Story: DescriptionOutlined,
  Film: Movie,
  'Ethno Art': FilterVintage,
  Other: HelpOutlined,
};

export const ProductCard = ({ product, className }: ProductCardProps) => {
  const { classes, cx } = useStyles();

  const Icon = product.category ? iconMap[product.category] : undefined;

  return (
    <Card className={cx(classes.root, className)}>
      <CardActionAreaLink
        to={`/products/${idForUrl(product)}`}
        className={classes.actionArea}
      >
        <Grid component={CardContent} container spacing={2} alignItems="center">
          {Icon && (
            <Grid item>
              <HugeIcon className={classes.icon} icon={Icon} />
            </Grid>
          )}
          <Grid item>
            <Typography variant="h4">{product.label}</Typography>
            <Typography variant="body2">{product.category}</Typography>
          </Grid>
        </Grid>
      </CardActionAreaLink>
    </Card>
  );
};
