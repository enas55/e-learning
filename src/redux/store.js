import { configureStore, createSlice } from '@reduxjs/toolkit';
import authEn from '../locales/en/authEn.json';
import authAr from '../locales/ar/authAr.json';
import navbarEn from '../locales/en/navbarEn.json';
import navbarAr from '../locales/ar/navbarAr.json';
import bannerAr from '../locales/ar/bannerAr.json';
import bannerEn from '../locales/en/bannerEn.json';
import footerEn from '../locales/en/footerEn.json';
import footerAr from '../locales/ar/footerAr.json';
import courseCardEn from '../locales/en/courseCardEn.json';
import courseCardAr from '../locales/ar/courseCardAr.json';
import confirmDialogEn from '../locales/en/confirmDialogEn.json';
import confirmDialogAr from '../locales/ar/confirmDialogAr.json';
import filterAndMainTitlesEn from '../locales/en/filter_and_main_titlesEn.json';
import filterAndMainTitlesAr from '../locales/ar/filter_and_main_titlesAr.json';
import snackbarEn from '../locales/en/snackbarEn.json';
import snackbarAr from '../locales/ar/snackbarAr.json';


const translationSlice = createSlice({
    name: 'translation',
    initialState: {
        language: 'en',
        translations: {
            en: { navbar: navbarEn, 
                auth: authEn, 
                banner: bannerEn, 
                footer: footerEn, 
                courseCard: courseCardEn, 
                confirmDialog: confirmDialogEn,
                filterAndMainTiltles : filterAndMainTitlesEn,
                snackbar : snackbarEn
            },
            ar: { navbar: navbarAr, 
                auth: authAr, 
                banner: bannerAr, 
                footer: footerAr, 
                courseCard: courseCardAr, 
                confirmDialog: confirmDialogAr,
                filterAndMainTiltles : filterAndMainTitlesAr,
                snackbar : snackbarAr
            },
        },
    },
    reducers: {
        setLanguage: (state, action) => {
            state.language = action.payload;
            localStorage.setItem('appLanguage', action.payload);
        },
    },
});


const store = configureStore({
    reducer: {
        translation: translationSlice.reducer,
    },
});

export const { setLanguage } = translationSlice.actions;

export default store;