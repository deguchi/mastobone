import I18n from 'react-native-i18n';

// Enable fallbacks if you want `en-US` and `en-GB` to fallback to `en`
I18n.fallbacks = true

I18n.translations = {
  en: {
    Home: 'Home'
  },
  ja: {
    Home: 'ホーム'
  }
};

export default I18n;