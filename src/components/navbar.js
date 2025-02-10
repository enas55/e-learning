import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLanguage } from '../redux/store';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, MenuItem, Avatar, Tooltip, Container, Badge } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LanguageIcon from '@mui/icons-material/Language';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { auth } from '../firebase/firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import ConfirmDialog from './confirmDialog';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

function ResponsiveAppBar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { language, translations } = useSelector((state) => state.translation);
    const { favoriteCourses } = useSelector((state) => state.favorites);
    const t = translations[language].navbar;
    const confirmDialogT = translations[language].confirmDialog;
    const location = useLocation();

    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [openLogoutConfirm, setOpenLogoutConfirm] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    useEffect(() => {
        const savedLanguage = localStorage.getItem('appLanguage') || 'en';
        dispatch(setLanguage(savedLanguage));

        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                const userRef = doc(db, "users", currentUser.uid);
                const userDoc = await getDoc(userRef);
                if (userDoc.exists()) {
                    setUserRole(userDoc.data().role);
                }
            } else {
                setUserRole(null);
            }
        });

        return () => unsubscribe();
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

    const handleLogoutClick = () => {
        setOpenLogoutConfirm(true);
    };

    const handleConfirmLogout = async () => {
        setOpenLogoutConfirm(false);
        setIsLoggingOut(true);

        try {
            await signOut(auth);
            setUser(null);
            setUserRole(null);
            navigate("/");
        } catch (error) {
            console.error("Error signing out:", error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    

    const toggleLanguage = () => {
        const newLanguage = language === 'en' ? 'ar' : 'en';
        dispatch(setLanguage(newLanguage));
    };

    const handleDashboardClick = () => {
        if (userRole === 'admin') {
            navigate('/admin-dashboard');
            handleCloseUserMenu();
        } else {
            navigate('/user-dashboard');
            handleCloseUserMenu();
        }
    };

    const handleProfileClick = () => {
        navigate('/profile');
        handleCloseUserMenu();
    };

    let pages = [
        { label: t.Home, path: '/' },
        { label: t.All_courses, path: '/all-courses' }
    ];

    if (user) {
        pages.push({
            label: (
                <Badge badgeContent={favoriteCourses.length} color="warning">
                    {t.Favorite}
                </Badge>
            ),
            path: '/favorite'
        });
    }

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
                                <MenuItem key={path} onClick={handleCloseNavMenu}>
                                    <Typography sx={{ textAlign: 'center' }}>
                                        <Link to={path} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            {label}
                                        </Link>
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }, alignItems: 'center', justifyContent: 'center' }}>
                        <MenuBookIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                        <Typography
                            variant="h6"
                            noWrap
                            component={Link}
                            to="/"
                            sx={{
                                display: { xs: 'flex', md: 'none' },
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            {t.Logo}
                        </Typography>
                    </Box>

                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map(({ label, path }) => (
                            <Typography
                                key={path}
                                component={Link}
                                to={path}
                                sx={{
                                    my: 2,
                                    mx: 2,
                                    color: isActive(path) ? '#FCD980' : 'white',
                                    textDecoration: 'none',
                                    cursor: 'pointer',
                                }}
                            >
                                {label}
                            </Typography>
                        ))}
                    </Box>

                    {user ? (
                        <Box sx={{ flexGrow: 0, ml: 2 }}>
                            <Tooltip title="User settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar alt="User" src={user.photoURL || "/static/images/avatar/2.jpg"} />
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
                                <MenuItem onClick={handleProfileClick}>
                                    <Typography sx={{ textAlign: 'center' }}>{t.Profile}</Typography>
                                </MenuItem>
                                <MenuItem onClick={handleDashboardClick}>
                                    <Typography sx={{ textAlign: 'center' }}>
                                        {t.Dashboard}
                                    </Typography>
                                </MenuItem>
                                <MenuItem onClick={handleLogoutClick}>
                                    <Typography sx={{ textAlign: 'center' }}>{t.Logout}</Typography>
                                </MenuItem>
                            </Menu>
                        </Box>
                    ) : (
                        <Box sx={{ flexGrow: 0, ml: 2 }}>
                            <Typography
                                component={Link}
                                to="/auth"
                                sx={{
                                    color: 'white',
                                    textDecoration: 'none',
                                    cursor: 'pointer',
                                    '&:hover': { textDecoration: 'underline' }
                                }}
                            >
                                {t.Register}
                            </Typography>
                        </Box>
                    )}

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
            <ConfirmDialog
                open={openLogoutConfirm}
                onClose={() => setOpenLogoutConfirm(false)}
                onConfirm={handleConfirmLogout}
                title={confirmDialogT.Logout_Title}
                message={confirmDialogT.Logout_Msg}
                confirmText={confirmDialogT.Logout_Text}
                cancelText={confirmDialogT.Logout_cancel}
            />
        </AppBar>
    );
}

export default ResponsiveAppBar;