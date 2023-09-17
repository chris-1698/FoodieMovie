import { Button, Menu, MenuItem, Link, Typography } from '@mui/material';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTING_MANAGER } from '../navigation/Router';
import { Store } from '../utils/Store';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useTranslation } from 'react-i18next';

// TODO: adaptar a nueva implementación.
export default function ProfileSettings() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  const { t } = useTranslation();

  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  // const { state, dispatch } = useContext(Store)
  // const { userInfo } = state;
  const menuHandleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const signOutHandler = () => {
    dispatch({ type: 'USER_SIGN_OUT' })
    localStorage.removeItem('userInfo');
    localStorage.removeItem('cartItems');
    localStorage.removeItem('product-slug');
    localStorage.removeItem('orderDetails');
    localStorage.removeItem('paymentMethod');
    window.location.href = '/signin'
  }
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {!userInfo ? (
        <div>
          <Button
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={menuHandleClick}
            sx={{ color: '#ffffff' }}
          >
            {t('settings.login')}
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
            <Link href={ROUTING_MANAGER.SIGN_IN} sx={{ color: 'primary' }}>
              <MenuItem>{t('settings.signIn')} </MenuItem>
            </Link>

            <Link href="/register" sx={{ color: 'primary' }}>
              <MenuItem> {t('settings.createAccount')} </MenuItem>
            </Link>
          </Menu>
        </div>
      ) : (
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
                fontFamily: 'inherit',
              }}
            >
              {' '}
              {t('settings.greeting')} {' '}
              {userInfo.name}{t('settings.exclamation')}{' '}
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
              <AccountCircleIcon fontSize='large' />
              <Typography className="user-fullname" style={{ marginLeft: '2%' }}>
                {userInfo.name + ' ' + userInfo.lastName}
              </Typography>
            </MenuItem>
            <MenuItem disabled>
              <Typography
                style={{ fontWeight: 'bold' }}
                fontSize={'12px'}>{userInfo.email}</Typography>
            </MenuItem>
            <MenuItem>
              <Link>{t('settings.orderHistory')}</Link>
            </MenuItem>
            {/* TODO: Implementar borrar cuenta! */}
            <Link href="https://github.com/" className="delete-account">
              <MenuItem>
                <Typography className="delete-account">
                  {t('settings.deleteAccount')}
                </Typography>
              </MenuItem>
            </Link>
            <MenuItem>
              <Link
                sx={{ paddingRight: '15%' }}
                className="log-out"
                href='#signout'
                onClick={signOutHandler}
              >
                {t('settings.logOut')}
              </Link>
            </MenuItem>
          </Menu>
        </>
      )
      }
    </>
  );
}
