import { Platform } from "react-native";

// NavBar分の高さをpaddingTopであける
export default {
  ...Platform.select({
    ios: {
      paddingTop: 64,
    },
    android: {
      paddingTop: 54,
    },
  }),
};
