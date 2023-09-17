import { Button, Link, Badge } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useContext } from 'react';
import { Store } from '../utils/Store';

export default function ShoppingCart() {
  const { state } = useContext(Store);
  const { cart } = state;
  return (
    <>
      <Button
        sx={{
          paddingRight: '15px',
          paddingTop: '10px',
        }}
      >
        <Link href="/cart">
          <ShoppingCartIcon
            sx={{
              color: 'white',
            }}
          />
          {cart.cartItems.length > 0 && (
            <Badge color="warning" variant="dot">
              {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
            </Badge>
          )}
        </Link>
      </Button>
    </>
  );
}
