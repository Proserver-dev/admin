import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationsPL from './pl.json';
import translationsGB from './gb.json';
import Settings from "../Settings";
import Cookies from "js-cookie";

i18n.use(initReactI18next).init({
    resources: {
        PL: { translation: translationsPL },
        GB: { translation: translationsGB },
    },
    lng: Cookies.get('currentLang'),
    fallbackLng: Settings.DEFAULT_LANG,
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;