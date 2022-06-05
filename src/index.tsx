import './wdyr'; // <--- first import
import React from 'react';
import ReactDOM from 'react-dom';
import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import './index.css';
import './assets/styles/sanitize.css';
import './assets/styles/general.css';
import App from './components/App';

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

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    // the translations
    // (tip move them in a JSON file and import them,
    // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
    resources: {
      en: {
        translation: {
          search: {
            'input-aria-label': 'Search',
            'input-placeholder': 'Songs',
            'clear-search-field-aria-label': 'Clear search field',
            'no-result-item-error': {
              'big-message': 'Couldn\'t find "{{query}}"',
              'small-message':
                'Try searching again using a different spelling or keyword.',
            },
            'no-internet-connection-error': {
              'big-message': 'No internet connection',
              'small-message': 'Go online to search again.',
            },
          },
          'show-audio-features': {
            acousticness: 'Acousticness',
            danceability: 'Danceability',
            energy: 'Energy',
            instrumentalness: 'Instrumentalness',
            liveness: 'Liveness',
            speechiness: 'Speechiness',
            valence: 'Valence',
          },
          'not-found-view': {
            'big-message': 'Page not found',
            'small-message':
              'We can’t seem to find the page you are looking for.',
          },
          'page-loading-failed-view': {
            'big-message': "Couldn't load the page.",
            'small-message': 'Try again?',
            'reload-button': 'RELOAD',
          },
        },
      },
      ja: {
        translation: {
          search: {
            'input-aria-label': '検索',
            'input-placeholder': '曲を検索',
            'clear-search-field-aria-label': '検索フィールドをクリア',
            'no-result-item-error': {
              'big-message': '「{{query}}」 に 一致する結果はありません',
              'small-message': '別のキーワードでもう一度検索してください。',
            },
            'no-internet-connection-error': {
              'big-message': 'インターネットに接続していません',
              'small-message':
                'インターネットに接続してから再検索してください。',
            },
          },
          'show-audio-features': {
            acousticness: 'アコースティック度',
            danceability: '踊りやすさ',
            energy: 'エネルギー',
            instrumentalness: 'インスト度',
            liveness: 'ライブ度',
            speechiness: 'スピーチ感',
            valence: 'ポジティブ度',
          },
          'not-found-view': {
            'big-message': 'ページが見つかりません',
            'small-message': 'お探しのページが見つかりません。',
          },
          'page-loading-failed-view': {
            'big-message': 'ページを読み込めませんでした',
            'small-message': '再試行しますか？',
            'reload-button': '再読み込み',
          },
        },
      },
    },
    lng: htmlLang, // if you're using a language detector, do not define the lng option
    fallbackLng: 'en',

    interpolation: {
      escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },
  });

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('main')
);
