import { Button, Menu, MenuItem, Link, Typography } from '@mui/material';
import React from 'react';
import {
  SignOutButton,
  UserButton,
  useClerk,
  useSession,
  useUser,
} from '@clerk/clerk-react';
import { redirect, useNavigate } from 'react-router-dom';

export default function ProfileSettings() {
  const session = useSession();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();

  const menuHandleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {/* <Divider sx={classes.divider}> */}
      {!session.isSignedIn && session.isLoaded ? (
        <div>
          <Button
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={menuHandleClick}
            sx={{ color: '#ffffff' }}
          >
            Inicia sesión ▾
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <Link href="/sign-in" sx={{ color: 'primary' }}>
              <MenuItem>Iniciar sesión </MenuItem>
            </Link>

            <Link href="/register" sx={{ color: 'primary' }}>
              <MenuItem> Crear cuenta </MenuItem>
            </Link>
          </Menu>
        </div>
      ) : (
        // <Link href="/sign-in"> Iniciar sesión</Link>
        // Aquí es donde iría lo del dibujo.
        //  Menú desplegable con <UserButton> y el historial de pedidos
        <>
          <Button
            id="logged-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={menuHandleClick}
            sx={{ color: '#ffffff' }}
          >
            <a
              style={{
                fontWeight: 'bold',
                fontFamily: 'Fantasy',
              }}
            >
              {' '}
              Hola, {user?.firstName}! ▾{' '}
            </a>
          </Button>
          <Menu
            id="logged-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem disabled className="user-avatar">
              <UserButton appearance={{}} />{' '}
              <Typography className="user-fullname">
                {user?.fullName}
              </Typography>
            </MenuItem>
            <MenuItem disabled>
              <Typography
                style={{ fontWeight: 'bold' }}
                fontSize={'12px'}
              >{`${user?.emailAddresses[0]}`}</Typography>
            </MenuItem>
            <Link href={`/user/${user?.id}`}>
              <MenuItem>
                <Typography>Perfil</Typography>
              </MenuItem>
            </Link>
            <MenuItem>
              <Link>Historial de pedidos</Link>
            </MenuItem>
            {/* TODO: Implementar borrar cuenta! */}
            <Link href="https://github.com/" className="delete-account">
              <MenuItem>
                <Typography className="delete-account">
                  Borrar cuenta
                </Typography>
              </MenuItem>
            </Link>
            <MenuItem>
              <SignOutButton>
                <Button
                  sx={{ paddingRight: '15%' }}
                  onClick={() => {
                    navigate('/combos');
                    localStorage.clear();
                    // localStorage.removeItem('userInfo');
                    // localStorage.removeItem('cartItems');
                    // localStorage.removeItem('product-slug');
                    // localStorage.removeItem('orderDetails');
                    // localStorage.removeItem('paymentMethod')
                    window.location.reload();
                  }}
                  className="log-out"
                  color="primary"
                >
                  Cerrar sesión
                </Button>
              </SignOutButton>
            </MenuItem>
          </Menu>
        </>
      )}
      {/* </Divider> */}
    </>
  );
}
