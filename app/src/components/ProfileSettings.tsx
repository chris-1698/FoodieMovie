import { Button, Menu, MenuItem, Link, Typography, Dialog, DialogContent, DialogContentText, TextField, DialogActions, Grid } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTING_MANAGER } from '../navigation/Router';
import { Store } from '../utils/Store';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import { useTranslation } from 'react-i18next';
import generator from 'generate-password-ts'
import { useDeleteUserMutation } from '../hooks/userHooks';

const CODE_REGEXP = new RegExp('^[A-Za-z0-9]+$')

export default function ProfileSettings() {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openDialog, setOpenDialog] = useState(false)
  const [deleteCode, setDeleteCode] = useState('')
  const [codeError, setCodeError] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [labelValue, setLabelValue] = useState(`${t('settings.enterCode')}`)
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  const { mutateAsync: deleteUser } = useDeleteUserMutation()
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleCloseDialog = () => {
    setLabelValue(`${t('settings.enterCode')}`)
    setCodeError(false)
    setOpenDialog(false);
  }
  const handleOpenDialog = () => {
    setDeleteCode(generator.generate({
      length: 5,
      numbers: true
    }))
    setOpenDialog(true);
  }

  const verifyCode = (code: string) => {
    if (CODE_REGEXP.test(code)) {
      if (code === deleteCode) {
        return true;
      } else {
        return false
      }
    } else {
      return false;
    }
  }

  const handleDeleteAccount = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const userData = JSON.parse(localStorage.getItem('userInfo')!)
    if (verifyCode(deleteConfirm)) {
      // Calling endpoint
      await deleteUser({
        email: userData.email,
      })
      signOutHandler()
    } else {
      setCodeError(true)
      setLabelValue(`${t('settings.wrongCode')}`)
    }
  }

  const menuHandleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const signOutHandler = () => {
    dispatch({ type: 'USER_SIGN_OUT' })
    window.location.href = '/signin'
    localStorage.removeItem('userInfo');
    localStorage.removeItem('cartItems');
    localStorage.removeItem('product-slug');
    localStorage.removeItem('orderDetails');
    localStorage.removeItem('paymentMethod');
    localStorage.removeItem('dateAsObj');
  }

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {/* User is not logged in */}
      {!userInfo ? (
        <div>
          <Button
            id="basic-button"
            aria-controls={open ? 'basic-menu' : 'nothing'}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : 'false'}
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
        // User is logged in and has employee rights
      ) : userInfo && userInfo.isEmployee === true ? (
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
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            {/* User icon and name */}
            <MenuItem disabled className="user-avatar">
              <AccountCircleIcon fontSize='large' />
              <Typography className="user-fullname" style={{ marginLeft: '2%' }}>
                {userInfo.name + ' ' + userInfo.lastName}
              </Typography>
            </MenuItem>

            {/* Email */}
            <MenuItem disabled>
              <Typography
                style={{ fontWeight: 'bold' }}
                fontSize={'12px'}>{userInfo.email}</Typography>
            </MenuItem>

            {/* Sign out */}
            <MenuItem onClick={signOutHandler}>
              <Link
                sx={{ paddingRight: '15%' }}
                className="log-out"
                href='#signout'
              >
                {t('settings.logOut')}
              </Link>
            </MenuItem>
          </Menu>
        </>


        // User is logged in and has no employee rights
      ) :
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
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            {/* User icon and name */}
            <MenuItem disabled className="user-avatar">
              <AccountCircleIcon fontSize='large' />
              <Typography className="user-fullname" style={{ marginLeft: '2%' }}>
                {userInfo.name + ' ' + userInfo.lastName}
              </Typography>
            </MenuItem>

            {/* Email */}
            <MenuItem disabled>
              <Typography
                style={{ fontWeight: 'bold' }}
                fontSize={'12px'}>{userInfo.email}</Typography>
            </MenuItem>

            {/* Order history */}
            <MenuItem onClick={() => navigate(ROUTING_MANAGER.ORDER_HISTORY)}>
              <Link>
                {t('settings.orderHistory')}
              </Link>
            </MenuItem>

            {/* Delete account */}
            <MenuItem onClick={handleOpenDialog}>
              <Link className="delete-account">
                {t('settings.deleteAccount')}
              </Link>
            </MenuItem>

            {/* Sign out */}
            <MenuItem onClick={signOutHandler}>
              <Link
                sx={{ paddingRight: '15%' }}
                className="log-out"
                href='#signout'
              >
                {t('settings.logOut')}
              </Link>
            </MenuItem>
          </Menu>

          {/* Delete account dialog */}
          <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
          >
            <DialogContent>
              <DialogContentText fontWeight={500}>
                {t('settings.deleteText1')}
                <br />
                {t('settings.deleteText2')}
                <br />
                <br />
                <strong style={{ fontFamily: 'monospace', fontSize: '40px' }}>{deleteCode}</strong>
              </DialogContentText>
              {/* Delete code input */}
              <TextField
                error={codeError}
                onClick={() => setLabelValue(`${t('settings.enterCode')}`)}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                autoFocus
                margin='dense'
                id='deleteCode'
                label={labelValue}
                type='text'
                fullWidth
                variant='standard' />
            </DialogContent>

            <DialogActions>
              <Button onClick={handleCloseDialog}>
                {t('settings.cancel')}
              </Button>
              <Button onClick={handleDeleteAccount}>
                {t('settings.confirm')}
              </Button>
            </DialogActions>
          </Dialog>
        </>
      }
    </>
  );
}