import React, { useState, useEffect } from 'react';
import {
    Typography,
    TextField,
    Button,
    Box,
    Link,
    Alert,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormLabel,
    IconButton,
    InputAdornment,
    Fade
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import backgroundImage from '../../assets/images/virtual_school_Learner-951895893.jpg';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { setLanguage } from '../../redux/store';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/firebaseConfig';

function AuthForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { language, translations } = useSelector((state) => state.translation);
    const t = translations[language].auth;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('user');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [nameError, setNameError] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [showPassword, setShowPassword] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isLogin) {
            document.title = t.login;
        } else {
            document.title = t.register;
        }
    }, [isLogin, t]);

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validatePassword = (password) => {
        const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
        return regex.test(password);
    };

    const validateName = (name) => {
        const regex = /^(?!\s*$).+/;
        return regex.test(name);
    };

    const validateLogin = () => {
        var isValid = true;

        if (!email) {
            setEmailError(t.email_required);
            isValid = false;
        } else if (!validateEmail(email)) {
            setEmailError(t.invalid_email);
            isValid = false;
        }

        if (!password) {
            setPasswordError(t.password_required);
            isValid = false;
        }

        return isValid;
    };

    const validateRegistration = () => {
        var isValid = true;

        if (!name) {
            setNameError(t.name_required);
            isValid = false;
        } else if (!validateName(name)) {
            setNameError(t.name_invalid);
            isValid = false;
        }

        if (!email) {
            setEmailError(t.email_required);
            isValid = false;
        } else if (!validateEmail(email)) {
            setEmailError(t.invalid_email);
            isValid = false;
        }

        if (!password) {
            setPasswordError(t.password_required);
            isValid = false;
        } else if (!validatePassword(password)) {
            setPasswordError(t.invalid_password);
            isValid = false;
        }

        return isValid;
    };

    useEffect(() => {
        if (alertMessage) {
            const timer = setTimeout(() => {
                setAlertMessage('');
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [alertMessage]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEmailError('');
        setPasswordError('');
        setNameError('');
        setAlertMessage('');

        const isValid = isLogin ? validateLogin() : validateRegistration();

        if (!isValid) {
            return;
        }

        setLoading(true);

        if (isLogin) {
            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
                const userData = userDoc.data();

                if (!userDoc.exists()) {
                    setLoading(false);
                    setEmailError(t.email_required);
                    throw new Error("No user found in Firestore");
                }

                setLoading(false);
                setAlertMessage(t.login_successful);
                setAlertSeverity('success');
                setTimeout(() => {
                    navigate(userData.role === 'admin' ? '/admin-dashboard' : '/user-dashboard');
                }, 2000);
                setEmail('');
                setPassword('');
            } catch (error) {
                setLoading(false);
                if (error.code === "auth/user-not-found") {
                    setEmailError(t.no_account_found);
                } else if (error.code === "auth/wrong-password") {
                    setPasswordError(t.wrong_password);
                } else if (error.code === "auth/invalid-email") {
                    setEmailError(t.invalid_email);
                }
                setAlertMessage(error.message);
                setAlertSeverity('error');
            }
        } else {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await setDoc(doc(db, 'users', userCredential.user.uid), { name, email, role });

                setLoading(false);
                setIsLogin(true);
                setAlertMessage(t.registration_successful);
                setAlertSeverity('success');
                setEmail('');
                setPassword('');
                setName('');
                setRole('user');
            } catch (error) {
                setLoading(false);
                if (error.code === "auth/email-already-in-use") {
                    setEmailError(t.email_already_in_use);
                } else if (error.code === "auth/invalid-email") {
                    setEmailError(t.invalid_email);
                }
                setAlertMessage(error.message);
                setAlertSeverity('error');
            }
        }
    };

    const toggleLanguage = () => {
        const newLanguage = language === 'en' ? 'ar' : 'en';
        dispatch(setLanguage(newLanguage));
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                height: '100vh',
                width: '100vw',
                overflow: 'hidden',
                direction: language === 'ar' ? 'rtl' : 'ltr',
            }}
        >
            {/* left */}
            <Box
                sx={{
                    flexBasis: '50%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    padding: '0 5%',
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                    height: '100vh',
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    }}
                />
                <Box sx={{ position: 'relative', zIndex: 1, color: 'white' }}>
                    <Typography variant="h4" fontWeight="bold">
                        {t.move_forward}
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" sx={{ mt: -1 }}>
                        {t.closer_to}
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
                        {t.your_dreams}
                    </Typography>
                    <Typography variant="body1">
                        {t.platform_description}
                    </Typography>
                </Box>
            </Box>

            {/* right */}
            <Box
                sx={{
                    flexBasis: '50%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#1C1E53',
                    padding: '0 5%',
                    height: '100vh',
                }}
            >
                {/* swithch lang btn */}
                <Button
                    onClick={toggleLanguage}
                    variant="outlined"
                    sx={{
                        position: 'absolute',
                        top: 20,
                        right: language === 'ar' ? 'unset' : 20,
                        left: language === 'ar' ? 20 : 'unset',
                        color: '#FCD980',
                        borderColor: '#FCD980',
                        '&:hover': {
                            borderColor: '#FCD980',
                            backgroundColor: 'rgba(252, 217, 128, 0.1)',
                        },
                    }}
                >
                    {language === 'en' ? 'العربية' : 'English'}
                </Button>

                <Typography variant="h5" color="white" fontWeight="bold" mb={1}>
                    {isLogin ? t.login : t.register}
                </Typography>
                <Typography variant="body2" color="white" mb={3}>
                    {isLogin ? t.welcome_back : t.prepare_future}
                </Typography>

                {alertMessage && (
                    <Fade in={!!alertMessage}>
                        <Alert
                            severity={alertSeverity}
                            sx={{
                                width: '70%',
                                marginBottom: 2,
                                top: 20,
                                direction: language === 'ar' ? 'rtl' : 'ltr',
                                '& .MuiAlert-action': {
                                    marginRight: language === 'ar' ? 'auto' : '8px',
                                    marginLeft: language === 'ar' ? '8px' : 'auto',
                                },
                            }}
                            onClose={() => setAlertMessage('')}
                        >
                            {alertMessage}
                        </Alert>
                    </Fade>
                )}

                <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '400px' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {!isLogin && (
                            <TextField
                                fullWidth
                                label={t.name}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                error={!!nameError}
                                helperText={nameError}
                                dir={language === 'ar' ? 'rtl' : 'ltr'}
                                sx={{
                                    backgroundColor: 'transparent',
                                    borderRadius: '5px',
                                    '& label': {
                                        color: '#A0A0A0',
                                        textAlign: language === 'ar' ? 'right' : 'left',
                                    },
                                    '& label.Mui-focused': { color: '#A0A0A0' },
                                    '& label.Mui-error': { color: '#A0A0A0' },
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: '#A0A0A0',
                                        },
                                        '&:hover fieldset': { borderColor: '#A0A0A0' },
                                        '&.Mui-focused fieldset': { borderColor: '#A0A0A0' },
                                        '&.Mui-error fieldset': { borderColor: '#A0A0A0' },
                                    },
                                    '& input': {
                                        color: '#A0A0A0',
                                        textAlign: language === 'ar' ? 'right' : 'left',
                                    },
                                }}
                            />
                        )}

                        <TextField
                            fullWidth
                            label={t.email}
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            error={!!emailError}
                            helperText={emailError}
                            dir={language === 'ar' ? 'rtl' : 'ltr'}
                            sx={{
                                backgroundColor: 'transparent',
                                borderRadius: '5px',
                                '& label': {
                                    color: '#A0A0A0',
                                    textAlign: language === 'ar' ? 'right' : 'left',
                                },
                                '& label.Mui-focused': { color: '#A0A0A0' },
                                '& label.Mui-error': { color: '#A0A0A0' },
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: '#A0A0A0',
                                    },
                                    '&:hover fieldset': { borderColor: '#A0A0A0' },
                                    '&.Mui-focused fieldset': { borderColor: '#A0A0A0' },
                                    '&.Mui-error fieldset': { borderColor: '#A0A0A0' },
                                },
                                '& input': {
                                    color: '#A0A0A0',
                                    textAlign: language === 'ar' ? 'right' : 'left',
                                },
                            }}
                        />

                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <TextField
                                fullWidth
                                label={t.password}
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                error={!!passwordError}
                                helperText={passwordError}
                                dir={language === 'ar' ? 'rtl' : 'ltr'}
                                sx={{
                                    backgroundColor: 'transparent',
                                    borderRadius: '5px',
                                    '& label': {
                                        color: '#A0A0A0',
                                        textAlign: language === 'ar' ? 'right' : 'left',
                                    },
                                    '& label.Mui-focused': { color: '#A0A0A0' },
                                    '& label.Mui-error': { color: '#A0A0A0' },
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: '#A0A0A0',
                                        },
                                        '&:hover fieldset': { borderColor: '#A0A0A0' },
                                        '&.Mui-focused fieldset': { borderColor: '#A0A0A0' },
                                        '&.Mui-error fieldset': { borderColor: '#A0A0A0' },
                                    },
                                    '& input': {
                                        color: '#A0A0A0',
                                        textAlign: language === 'ar' ? 'right' : 'left',
                                    },
                                }}
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                    sx={{ color: '#A0A0A0' }}
                                                >
                                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />
                        </Box>

                        {!isLogin && (
                            <Box>
                                <FormLabel sx={{ color: 'white', fontWeight: 'bold' }}>{t.register_as}</FormLabel>
                                <RadioGroup
                                    row
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    <FormControlLabel
                                        value="user"
                                        control={
                                            <Radio
                                                sx={{
                                                    color: '#FCD980',
                                                    '&.Mui-checked': {
                                                        color: '#FCD980',
                                                    },
                                                }}
                                            />
                                        }
                                        label={<Typography color="white">{t.user}</Typography>}
                                    />
                                    <FormControlLabel
                                        value="admin"
                                        control={
                                            <Radio
                                                sx={{
                                                    color: '#FCD980',
                                                    '&.Mui-checked': {
                                                        color: '#FCD980',
                                                    },
                                                }}
                                            />
                                        }
                                        label={<Typography color="white">{t.admin}</Typography>}
                                    />
                                </RadioGroup>
                            </Box>
                        )}

                        <Button
                            type="submit"
                            fullWidth
                            disabled={loading}
                            variant="contained"
                            sx={{
                                backgroundColor: '#FCD980',
                                color: 'black',
                                fontWeight: 'bold',
                                padding: '10px',
                            }}
                        >
                            {loading ? t.loading : isLogin ? t.login : t.register}
                        </Button>
                    </Box>
                </form>

                <Typography variant="body2" color="white" align="center" sx={{ mt: 2 }}>
                    {isLogin ? t.dont_have_account : t.already_have_account}
                    <Link
                        href="#"
                        color="#FCD980"
                        sx={{ fontWeight: 'bold' }}
                        onClick={() => {
                            setEmailError('');
                            setPasswordError('');
                            setNameError('');
                            setAlertMessage('');
                            setIsLogin(!isLogin);
                            if (isLogin) {
                                setEmail('');
                                setPassword('');
                            } else {
                                setEmail('');
                                setPassword('');
                                setName('');
                                setRole('user');
                            }
                        }}
                    >
                        {isLogin ? t.register : t.login}
                    </Link>
                </Typography>
            </Box>
        </Box>
    );
}

export default AuthForm;