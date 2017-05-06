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
    EnterDomain: 'Enter instance domain',
    NewTwoot: 'new Twoot',
    WhatDoing: 'What are you doing now?',
    Twoot: 'Twoot!',
  },
  ja: {
    Home: 'ホーム',
    Login: 'ログイン',
    Welcome: 'ようこそ',
    EnterDomain: 'Enter instance domain',
    NewTwoot: '新規つぶやき',
    WhatDoing: 'いまなにしてる？',
    Twoot: 'トゥート！',
  }
};

export default I18n;