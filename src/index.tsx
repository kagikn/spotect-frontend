import React from 'react';
import ReactDOM from 'react-dom';
import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import './index.css';
import './assets/styles/sanitize.css';
import './assets/styles/general.css';
// Have to write the extension when importing json files with Vite
// eslint-disable-next-line import/extensions
import enLocalesTranslationJson from '@/assets/locales/en/translations.json';
// eslint-disable-next-line import/extensions
import jaLocalesTranslationJson from '@/assets/locales/ja/translations.json';
import App from './App';

const htmlLang = (function changeHtmlLang() {
  const firstAcceptLang = navigator.languages[0];
  const langRegex = /(?<language>[A-Za-z]{2,3})-/;
  const regexResult = langRegex.exec(firstAcceptLang);

  const targetHtmlLang = regexResult ? regexResult[1] : firstAcceptLang;

  if (targetHtmlLang === 'ja') {
    document.documentElement.setAttribute('lang', targetHtmlLang);
    return 'ja';
  }

  return 'en';
})();

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: enLocalesTranslationJson,
    },
    ja: {
      translation: jaLocalesTranslationJson,
    },
  },
  lng: htmlLang,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('main')
);
