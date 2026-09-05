import { Button, Link, Badge } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useContext } from 'react';
import { Store } from '../utils/Store';
import { useNavigate } from 'react-router-dom';

export default function ShoppingCart() {
  const { state } = useContext(Store);
  const { cart } = state;

  const navigate = useNavigate();
  return (
    <>
      <Button
        sx={{
          paddingRight: '15px',
          paddingTop: '10px',
        }}
        onClick={() => navigate('/cart')}
      >
        {/* <Link href="/cart"> */}

        {/* {cart.cartItems.length > 0 && ( */}
        <Badge color="warning"
          badgeContent={cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
          max={999}>
          <ShoppingCartIcon
            sx={{
              color: 'white',
            }}
          />
        </Badge>
        {/* )} */}
        {/* </Link> */}
      </Button>
    </>
  );
}
