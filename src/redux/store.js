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
import courseDetailsEn from '../locales/en/courseDetailsEn.json';
import courseDetailsAr from '../locales/ar/courseDetailsAr.json';
import favoriteEn from '../locales/en/favoriteEn.json';
import favoriteAr from '../locales/ar/favoriteAr.json';
import userDashboardEn from '../locales/en/userDasboardEn.json';
import userDashboardAr from '../locales/ar/userDashboardAr.json';
import pageNamesEn from '../locales/en/pageNamesEn.json';
import pageNamesAr from '../locales/ar/pagesNamesAr.json';
import adminDashboardEn from '../locales/en/adminDahboardEn.json';
import adminDashboardAr from '../locales/ar/adminDashboardAr.json';
import addCourseEn from '../locales/en/addCourseEn.json';
import addCourseAr from '../locales/ar/addCourseAr.json';
import editCourseEn from '../locales/en/editCourseEn.json';
import editCourseAr from '../locales/ar/editCourseAr.json';
import usersEn from '../locales/en/usersEn.json';
import usersAr from '../locales/ar/usersAr.json';
import joinedCoursesEn from '../locales/en/joinedCoursesEn.json';
import joinedCoursesAr from '../locales/ar/joinedCoursesAr.json';

// Fav slice
const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    favoriteCourses: [],
  },
  reducers: {
    addFavorite: (state, action) => {
      state.favoriteCourses.push(action.payload);
    },
    removeFavorite: (state, action) => {
      state.favoriteCourses = state.favoriteCourses.filter(course => course.id !== action.payload);
    },
    setFavorites: (state, action) => {
      state.favoriteCourses = action.payload;
    },
  },
});

export const { addFavorite, removeFavorite, setFavorites } = favoritesSlice.actions;

// translation slice
const translationSlice = createSlice({
  name: 'translation',
  initialState: {
    language: 'en',
    translations: {
      en: {
        navbar: navbarEn,
        auth: authEn,
        banner: bannerEn,
        footer: footerEn,
        courseCard: courseCardEn,
        confirmDialog: confirmDialogEn,
        filterAndMainTiltles: filterAndMainTitlesEn,
        snackbar: snackbarEn,
        courseDetails : courseDetailsEn,
        favorite: favoriteEn,
        userDashboard: userDashboardEn,
        pageNames: pageNamesEn,
        adminDashboard: adminDashboardEn,
        addCourse: addCourseEn,
        editCourse: editCourseEn,
        users : usersEn,
        joinedCourses : joinedCoursesEn
      },
      ar: {
        navbar: navbarAr,
        auth: authAr,
        banner: bannerAr,
        footer: footerAr,
        courseCard: courseCardAr,
        confirmDialog: confirmDialogAr,
        filterAndMainTiltles: filterAndMainTitlesAr,
        snackbar: snackbarAr,
        courseDetails: courseDetailsAr,
        favorite: favoriteAr,
        userDashboard: userDashboardAr,
        pageNames: pageNamesAr,
        adminDashboard: adminDashboardAr,
        addCourse: addCourseAr,
        editCourse: editCourseAr,
        users : usersAr,
        joinedCourses : joinedCoursesAr
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

// store
const store = configureStore({
  reducer: {
    favorites: favoritesSlice.reducer,
    translation: translationSlice.reducer,
  },
});

export const { setLanguage } = translationSlice.actions;

export default store;