import React from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
// import View from '../view';
// import Button from '../button';
import { navigation } from '../../actions';
// import { network } from '../../constants';
// boltzOnion

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
// import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import { Apps } from '@mui/icons-material';

// boltz_logo
const boltz_logo = require('../../asset/icons/logonobg.png');

const pages = ['Swap', 'Refund', 'FAQ'];
// const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const DeskTopNavigationBar = ({ classes }) => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [show, setShow] = React.useState(false);
  const [userAddress, setUserAddress] = React.useState('Wallet Address');

  const handleOpenNavMenu = event => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = event => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleNav = page => {
    console.log('navbar page: ', page.target.textContent);
    switch (page.target.textContent) {
      case 'Swap':
        navigation.navHome();
        break;

      case 'Refund':
        navigation.navRefund();
        break;

      case 'FAQ':
        navigation.navFaq();
        break;

      default:
        break;
    }
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static" sx={{}}>
      <Container maxWidth={false}>
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex', cursor: 'pointer' },
              alignItems: 'center',
            }}
            onClick={() => navigation.navHome()}
          >
            {/* <img
              src={boltz_logo}
              height={129}
              width={452}
              className={classes.img}
              alt="logo"
            /> */}
            <span className={classes.logoText}>LN</span>
            <Avatar alt="LNSwap Icon" src="./whiteicon.png" sx={{}} />
            <span className={classes.logoText}>SWAP</span>
            {/* <span className={classes.subLogoText}>beta</span> */}
            {/* {network}  */}
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <Apps />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map(page => (
                <MenuItem
                  key={page}
                  // onClick={handleCloseNavMenu}
                  onClick={handleNav}
                >
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              display: { xs: 'flex', md: 'none' },
              cursor: 'pointer',
            }}
            onClick={() => navigation.navHome()}
          >
            LNSwap
          </Typography>
          <Box
            sx={{
              flexGrow: 1,
              justifyContent: 'flex-end ',
              display: { xs: 'none', md: 'flex' },
            }}
          >
            {pages.map(page => (
              <Button
                key={page}
                onClick={handleNav}
                sx={{
                  my: 2,
                  color: 'white',
                  display: 'block',
                  fontSize: '1rem',
                }}
              >
                {page}
              </Button>
            ))}
          </Box>

          {/* <ButtonGroup variant="outlined" aria-label="outlined button group">
            <Button className={classes.outlineButtons}>{userAddress}</Button>
            {show && <Button className={classes.outlineButtons}><LogoutIcon color="disabled" /></Button>}
          </ButtonGroup> */}

          {/* <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box> */}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

//   <View className={classes.wrapper}>
//     <View className={classes.logo} onClick={() => navigation.navHome()}>
//       <img
//         src={boltz_logo}
//         height={40}
//         width={40}
//         className={classes.img}
//         alt="logo"
//       />
//       <span className={classes.logoText}>LNSwap</span>
//       <span className={classes.subLogoText}>{network} beta</span>
//     </View>
//     <View className={classes.buttons}>
//       <Button
//         className={classes.responsiveBtn}
//         text="Swap"
//         onPress={() => navigation.navHome()}
//       />
//       <Button
//         className={classes.responsiveBtn}
//         text="Refund"
//         onPress={() => navigation.navRefund()}
//       />
//       <Button
//         className={classes.responsiveBtn}
//         text="FAQ"
//         onPress={() => navigation.navFaq()}
//       />
//       <Button
//         className={classes.responsiveBtn}
//         text="Developers"
//         onPress={() => navigation.navDevelopers()}
//       />
//       {/* <Button
//         className={classes.responsiveBtn}
//         external
//         text="Onion URL"
//         to={boltzOnion}
//       /> */}
//       {/* <Button
//         className={classes.responsiveBtn}
//         external
//         text="Twitter"
//         to="https://twitter.com/boltzhq"
//       />
//       <Button
//         className={classes.responsiveBtn}
//         external
//         text="API"
//         to="https://docs.boltz.exchange/en/latest/"
//       /> */}
//       <Button
//         className={classes.responsiveBtn}
//         external
//         text="Github"
//         to="https://github.com/pseudozach/lnstxbridge"
//       />
//     </View>
//   </View>
// );

const styles = theme => ({
  wrapper: {
    flex: '1 1 content',
    justifyContent: 'space-between',
    alignItems: 'center',
    '@media (max-width: 425px)': {
      flexDirection: 'column',
    },
  },
  buttons: {
    marginRight: '10%',
    '@media (max-width: 425px)': {
      marginRight: '0%',
      justifyContent: 'space-around',
    },
  },
  logo: {
    width: 'auto',
    height: 'auto',
    margin: '20px',
    cursor: 'pointer',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  responsiveBtn: {
    '@media (max-width: 320px)': {
      fontSize: '20px',
    },
  },
  img: {
    alignSelf: 'center',
    // background: '#fff',
  },
  logoText: {
    color: '#fff',
    fontSize: '32px',
    fontfamily: 'SFProText',
    margin: '2px',
    fontWeight: '400',
  },
  subLogoText: {
    color: '#fff',
    fontSize: '15px',
    fontWeight: '100',
    textTransform: 'uppercase',
  },
});

DeskTopNavigationBar.propTypes = {
  classes: PropTypes.object,
};

export default injectSheet(styles)(DeskTopNavigationBar);
