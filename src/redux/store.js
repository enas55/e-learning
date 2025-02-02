import { configureStore, createSlice } from '@reduxjs/toolkit';
import english from '../locales/en/authEn.json';
import arabic from '../locales/ar/authAr.json';


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


const store = configureStore({
    reducer: {
        translation: translationSlice.reducer,
    },
});

export const { setLanguage } = translationSlice.actions;

export default store;