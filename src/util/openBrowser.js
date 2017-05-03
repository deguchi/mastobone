import {
  Platform,
  Linking,
} from 'react-native';

import SafariView from 'react-native-safari-view';
import theme from './theme';

export default (url) => {
  if (Platform.OS === 'ios') {
    SafariView.isAvailable()
      .then(SafariView.show({
        url: url,
        tintColor: theme.color.tint,
      }))
      .catch(error => {
        // Fallback WebView code for iOS 8 and earlier
        Linking.openURL(url);
      });
  } else {
    Linking.openURL(url);
  }
};
