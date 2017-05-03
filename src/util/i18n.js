/**
 * @flow
 */

import I18n from 'react-native-i18n';

// Enable fallbacks if you want `en-US` and `en-GB` to fallback to `en`
I18n.fallbacks = true

I18n.translations = {
  en: {
    Home: 'Home',
    Login: 'Home',
    Welcome: 'Welcome',
  },
  ja: {
    Home: 'ホーム',
    Login: 'ログイン',
    Welcome: 'ようこそ',
  }
};

export default I18n;