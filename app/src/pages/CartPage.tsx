import { useNavigate } from 'react-router-dom';
import { Store } from '../utils/Store';
import { useContext } from 'react';
import { CartItem } from '../typings/Cart';
import Layout from '../layouts/Layout';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {
  Box,
  Button,
  Card,
  CardMedia,
  Grid,
  IconButton,
  Link,
  List,
  ListItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { urlForCart } from '../utils/image';
// import { useUser } from '@clerk/clerk-react';
import useTitle from '../hooks/useTitle';
import { useTranslation } from 'react-i18next';

export default function CartPage({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  useTitle(title + subtitle);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    state: {
      cart: { cartItems },
    },
    dispatch,
  } = useContext(Store);

  const updateCartItemsHandler = (item: CartItem, quantity: number) => {
    // console.log(user?.firstName);
    if (item.countInStock < quantity) {
      //TODO: cambiar esto?
      alert('Lo sentimos. No contamos con stock de ese producto.');
      return;
    }

    dispatch({
      type: 'CART_ADD_ITEM',
      //Mantenemos el item y modificamos sólo la cantidad.
      payload: { ...item, quantity },
    });
  };
  //TODO Adaptar todo al nuevo login
  const checkOutHandler = () => {
    navigate('/orderDetails');
  };

  const removeItemHandler = (item: CartItem) => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: item });
  };

  return (
    <div>
      <Layout title="Carro" description="a">
        <Typography component="h1" variant="h1">
          {' '}
          {/*TODO: Texto */}
          {t('cart.cart')}
        </Typography>
        {cartItems.length === 0 ? (
          <Box>
            <Typography>
              {/*TODO: Texto */}
              {t('cart.emptyCart')}{' '}
              <Link href="/combos">{t('cart.productLink')}</Link>
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            <Grid item md={9} xs={12}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <Typography sx={{ fontWeight: 'bold' }}>
                          {/*TODO: Texto */}
                          {t('cart.image')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          sx={{ fontWeight: 'bold', paddingLeft: '15px' }}
                        >
                          {/*TODO: Texto */}
                          {t('cart.name')}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ paddingLeft: '35px' }}>
                        <Typography sx={{ fontWeight: 'bold' }}>
                          {/*TODO: Texto */}
                          {t('cart.quantity')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontWeight: 'bold' }}>
                          {/*TODO: Texto */}
                          {t('cart.price')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontWeight: 'bold' }}>
                          {t('cart.delete')}
                          {/*TODO: Texto */}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cartItems.map((item) => (
                      <TableRow
                        key={item.slug.current}
                        className="align-items-center"
                      >
                        <TableCell>
                          <Link
                            href={`/combos/${item.slug.current}`}
                            onClick={() => {
                              localStorage.setItem('product-slug', item.slug.current)
                            }}
                            onAuxClick={() => {
                              localStorage.setItem('product-slug', item.slug.current);
                            }}
                          >
                            <CardMedia
                              component="img"
                              image={urlForCart(item.image)}
                              width={50}
                              height={50}
                              alt={item.name}
                            ></CardMedia>
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Link href={`/combos/${item.slug.current}`}
                            onClick={() => {
                              localStorage.setItem('product-slug', item.slug.current)
                            }}
                            onAuxClick={() => {
                              localStorage.setItem('product-slug', item.slug.current);
                            }}>
                            <Typography>{item.name}</Typography>
                          </Link>
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() =>
                              updateCartItemsHandler(item, item.quantity - 1)
                            }
                            disabled={item.quantity === 1}
                          >
                            <RemoveCircleOutlineIcon />
                          </IconButton>{' '}
                          <span>{item.quantity}</span>{' '}
                          <IconButton
                            onClick={() =>
                              updateCartItemsHandler(item, item.quantity + 1)
                            }
                            // 3:13:14
                            disabled={item.quantity === item.countInStock}
                          >
                            <AddCircleOutlineIcon />
                          </IconButton>
                        </TableCell>
                        <TableCell>
                          <Typography>{item.price}€</Typography>
                        </TableCell>
                        <TableCell>
                          <IconButton
                            color="secondary"
                            onClick={() => removeItemHandler(item)}
                          >
                            <DeleteIcon color="primary"></DeleteIcon>
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item md={3} xs={12}>
              <Card>
                <List>
                  <ListItem>
                    <Typography variant="h2" align="center">
                      {/*TODO: Texto */}
                      {t('cart.subtotal')} ({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}
                      {t('cart.items')}):{' '}
                      {cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}{t('currency')}{' '}
                    </Typography>
                    {/* TODO: cadenas de texto en translation
                    y seguir con el tutorial  */}
                  </ListItem>
                  <ListItem>
                    <Button
                      fullWidth
                      color="primary"
                      variant="contained"
                      onClick={checkOutHandler}
                    >
                      {/*TODO: Texto */}
                      {t('cart.checkout')}
                    </Button>
                  </ListItem>
                </List>
              </Card>
            </Grid>
          </Grid>
        )}
      </Layout>
    </div>
  );
}
