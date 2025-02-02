import { configureStore, createSlice } from '@reduxjs/toolkit';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig';
import english from '../locales/en/authEn.json';
import arabic from '../locales/ar/authAr.json';

// trans slice
const translationSlice = createSlice({
    name: 'translation',
    initialState: {
        language: 'en',
        translations: {
            en: english,
            ar: arabic,
        },
    },
    reducers: {
        setLanguage: (state, action) => {
            state.language = action.payload;
        },
    },
});
// ============================================================================================================
// auth slice
const authSlice = createSlice({
    name: 'auth',
    initialState: {
        email: '',
        password: '',
        name: '',
        role: 'user',
        emailError: '',
        passwordError: '',
        nameError: '',
        alertMessage: '',
        alertSeverity: 'success',
        showPassword: false,
        isLogin: false,
        loading: false,
        error: null,
    },
    reducers: {
        setEmail: (state, action) => {
            state.email = action.payload;
        },
        setPassword: (state, action) => {
            state.password = action.payload;
        },
        setName: (state, action) => {
            state.name = action.payload;
        },
        setRole: (state, action) => {
            state.role = action.payload;
        },
        setEmailError: (state, action) => {
            state.emailError = action.payload;
        },
        setPasswordError: (state, action) => {
            state.passwordError = action.payload;
        },
        setNameError: (state, action) => {
            state.nameError = action.payload;
        },
        setAlertMessage: (state, action) => {
            state.alertMessage = action.payload;
        },
        setAlertSeverity: (state, action) => {
            state.alertSeverity = action.payload;
        },
        setShowPassword: (state, action) => {
            state.showPassword = action.payload;
        },
        setIsLogin: (state, action) => {
            state.isLogin = action.payload;
        },
        resetErrors: (state) => {
            state.emailError = '';
            state.passwordError = '';
            state.nameError = '';
            state.alertMessage = '';
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
    },
});
// =========================================================================================================
// firebase auth actin
export const registerUser = (userData) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const { email, password, name, role } = userData;
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', userCredential.user.uid), { name, email, role });
        dispatch(setLoading(false));
        dispatch(setAlertMessage('Registration successful! Please login.'));
        dispatch(setAlertSeverity('success'));
        dispatch(setEmail(''));
        dispatch(setPassword(''));
        dispatch(setName(''));
        dispatch(setRole('user'));
        return { user: userCredential.user, role };
    } catch (error) {
        dispatch(setLoading(false));
        if (error.code === "auth/email-already-in-use") {
            dispatch(setEmailError("This email is already registered"));
        } else if (error.code === "auth/invalid-email") {
            dispatch(setEmailError("Invalid email"));
        }
        throw error;
    }
};

export const loginUser = (credentials) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const { email, password } = credentials;
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
        const userData = userDoc.data();

        if (!userDoc.exists()) {
            dispatch(setLoading(false));
            dispatch(setEmailError("This email doesn't exist"));
            throw new Error("No user found in Firestore");
        }

        dispatch(setLoading(false));
        dispatch(setAlertMessage('Login successful'));
        dispatch(setAlertSeverity('success'));
        dispatch(setEmail(''));
        dispatch(setPassword(''));
        return { user: userCredential.user, role: userData.role };
    } catch (error) {
        dispatch(setLoading(false));
        if (error.code === "auth/user-not-found") {
            dispatch(setEmailError("No account found with this email"));
        } else if (error.code === "auth/wrong-password") {
            dispatch(setPasswordError("Wrong password, Try again"));
        } else if (error.code === "auth/invalid-email") {
            dispatch(setEmailError("Invalid email"));
        }
        throw error;
    }
};
// ============================================================================================================
// store
const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        translation: translationSlice.reducer,
    },
});


export const {
    setEmail,
    setPassword,
    setName,
    setRole,
    setEmailError,
    setPasswordError,
    setNameError,
    setAlertMessage,
    setAlertSeverity,
    setShowPassword,
    setIsLogin,
    resetErrors,
    setLoading,
} = authSlice.actions;

export const { setLanguage } = translationSlice.actions;

export default store;