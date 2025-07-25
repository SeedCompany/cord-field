import {
  DescriptionOutlined,
  FilterVintage,
  HelpOutlined,
  MenuBook,
  Movie,
  SvgIconComponent,
} from '@mui/icons-material';
import { Card, CardContent, Grid, Typography } from '@mui/material';
import { idForUrl } from '../Changeset';
import { HugeIcon } from '../Icons';
import { CardActionAreaLink } from '../Routing';
import { ProductCardFragment } from './ProductCard.graphql';

interface ProductCardProps {
  product: ProductCardFragment;
}

const iconMap: Record<string, SvgIconComponent> = {
  Scripture: MenuBook,
  Story: DescriptionOutlined,
  Film: Movie,
  'Ethno Art': FilterVintage,
  Other: HelpOutlined,
};

export const ProductCard = ({ product }: ProductCardProps) => {
  const Icon = product.category ? iconMap[product.category] : undefined;

  return (
    <Card
      sx={{
        display: 'flex',
        flex: 1,
      }}
    >
      <CardActionAreaLink
        to={`/products/${idForUrl(product)}`}
        sx={{ flex: 1 }}
      >
        <Grid component={CardContent} container spacing={2} alignItems="center">
          {Icon && (
            <Grid item>
              <HugeIcon sx={{ fontSize: 80 }} icon={Icon} />
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
