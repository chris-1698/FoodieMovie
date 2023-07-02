//TODO: Cambiar textos por literales. Seguir con el tutorial, VAMOOOOOOS
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Rating,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { urlForThumbnail } from '../utils/image';
import { ROUTING_MANAGER } from '../navigation/Router';

/* eslint-disable */
export default function DashboardProduct({ product }) {
  const { t } = useTranslation();
  //   console.log(product);

  return (
    <Card>
      <Link
        color="black"
        to={ROUTING_MANAGER.COMBO.replace(':slug', product.slug.current)}
        onClick={() => {
          localStorage.setItem('product-slug', product.slug.current);
        }}
        /*href={`/combos?product=${product.slug.current}`}*/
      >
        <CardActionArea>
          <CardMedia
            component="img"
            image={urlForThumbnail(product.image)}
            title={product.name}
          ></CardMedia>
          <CardContent>
            <Typography>{product.name}</Typography>
            <Typography>
              <Rating value={product.rating} readOnly></Rating> (
              {product.numReviews} reviews)
            </Typography>
          </CardContent>
        </CardActionArea>
      </Link>
      <CardActions>
        <Typography>{product.price}€</Typography>
        <Button size="small" color="primary">
          {t('dashboard.addCart')}
        </Button>
      </CardActions>
    </Card>
  );
}
