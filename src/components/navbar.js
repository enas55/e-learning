import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLanguage } from '../redux/store';
import { Link, useLocation } from 'react-router-dom';
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

function ResponsiveAppBar() {
    const dispatch = useDispatch();
    const { language, translations } = useSelector((state) => state.translation);
    const t = translations[language].navbar;

    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const location = useLocation();

    useEffect(() => {
        const savedLanguage = localStorage.getItem('appLanguage') || 'en';
        dispatch(setLanguage(savedLanguage));
    }, [dispatch]);

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
        const newLanguage = language === 'en' ? 'ar' : 'en';
        dispatch(setLanguage(newLanguage));
    };

    const pages = [
        { label: t.Home, path: '/' },
        { label: t.All_courses, path: '/all-courses' },
        { label: t.Favorite, path: '/favorite' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <AppBar position="static" sx={{ backgroundColor: '#1C1E53' }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <MenuBookIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component={Link}
                        to="/"
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
                        {t.Logo}
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="menu"
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
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                            keepMounted
                            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{ display: { xs: 'block', md: 'none' } }}
                        >
                            {pages.map(({ label, path }) => (
                                <MenuItem key={label} onClick={handleCloseNavMenu}>
                                    <Typography sx={{ textAlign: 'center' }}>
                                        <Link to={path} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            {label}
                                        </Link>
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>

                    <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', ml: 2 }}>
                        <TextField
                            variant="outlined"
                            placeholder={t.Search_label}
                            size="small"
                            sx={{
                                backgroundColor: 'white',
                                borderRadius: '8px',
                                width: { xs: '100%', sm: '250px', md: '300px' },
                            }}
                        />
                    </Box>

                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map(({ label, path }) => (
                            <Button
                                key={label}
                                component={Link}
                                to={path}
                                sx={{
                                    my: 2,
                                    color: isActive(path) ? '#FCD980' : 'white',
                                    display: 'block',
                                    textDecoration: isActive(path) ? 'underline' : 'none',
                                }}
                            >
                                {label}
                            </Button>
                        ))}
                    </Box>

                    <Box sx={{ flexGrow: 0, ml: 2 }}>
                        <Tooltip title="User settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt="User" src="/static/images/avatar/2.jpg" />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                            keepMounted
                            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {[t.Profile, t.Dashboard, t.Logout].map((setting) => (
                                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                    <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>

                    <Box sx={{ flexGrow: 0, mr: 1, ml: 2 }}>
                        <IconButton onClick={toggleLanguage} color="inherit">
                            <LanguageIcon />
                            <Typography variant="body1" sx={{ ml: 1 }}>
                                {language === 'en' ? 'English' : 'العربية'}
                            </Typography>
                        </IconButton>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default ResponsiveAppBar;
