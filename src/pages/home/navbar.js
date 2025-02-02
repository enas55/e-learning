import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import LanguageIcon from '@mui/icons-material/Language';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const pages = ['Home', 'All Courses', 'Cart', 'Favorite'];
const settings = ['Profile', 'Dashboard', 'Logout'];

function ResponsiveAppBar() {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [language, setLanguage] = useState('en');
    const location = useLocation();

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const toggleLanguage = () => {
        setLanguage((prevLanguage) => (prevLanguage === 'en' ? 'ar' : 'en'));
    };

    const isActive = (page) => {
        const path = location.pathname;
        if (page === 'Home') {
            return path === '/';
        } else if (page === 'All Courses') {
            return path === '/all-courses';
        } else if (page === 'Cart') {
            return path === '/cart';
        } else if (page === 'Favorite') {
            return path === '/favorite';
        }
        return false;
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: '#1C1E53' }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <MenuBookIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        EDUFREE
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
                            <MenuIcon />
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
                            sx={{ display: { xs: 'block', md: 'none' } }}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page} onClick={handleCloseNavMenu}>
                                    <Typography sx={{ textAlign: 'center' }}>
                                        {page === 'Home' ? (
                                            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                                                {page}
                                            </Link>
                                        ) : page === 'All Courses' ? (
                                            <Link to="/all-courses" style={{ textDecoration: 'none', color: 'inherit' }}>
                                                {page}
                                            </Link>
                                        ) : (
                                            page
                                        )}
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>

                    <Box sx={{ display: { xs: 'none', md: 'flex' } }} />

                    <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', ml: 2 }}>
                        <TextField
                            variant="outlined"
                            placeholder="Search..."
                            size="small"
                            sx={{
                                backgroundColor: 'white',
                                borderRadius: '4px',
                                width: { xs: '100%', sm: '250px', md: '300px' },
                            }}
                        />
                    </Box>

                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <Button
                                key={page}
                                onClick={handleCloseNavMenu}
                                sx={{ 
                                    my: 2, 
                                    color: isActive(page) ? '#FCD980' :'white', 
                                    display: 'block',
                                    textDecoration: isActive(page) ? 'underline' : 'none',
                                }}
                            >
                                {page === 'Home' ? (
                                    <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                                        {page}
                                    </Link>
                                ) : page === 'All Courses' ? (
                                    <Link to="/all-courses" style={{ textDecoration: 'none', color: 'inherit' }}>
                                        {page}
                                    </Link>
                                ) : (
                                    page
                                )}
                            </Button>
                        ))}
                    </Box>

                    <Box sx={{ flexGrow: 0, mr: 2 }}>
                        <IconButton onClick={toggleLanguage} color="inherit">
                            <LanguageIcon />
                            <Typography variant="body1" sx={{ ml: 1 }}>
                                {language === 'en' ? 'English' : 'العربية'}
                            </Typography>
                        </IconButton>
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt="User" src="/static/images/avatar/2.jpg" />
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
                                    <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default ResponsiveAppBar;