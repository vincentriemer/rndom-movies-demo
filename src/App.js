import React, { Component } from "react";
import {
  Platform,
  Animated,
  StyleSheet,
  YellowBox,
  UIManager,
  TouchableOpacity,
} from "react-native";
import { StackNavigator, TabNavigator, TabBarBottom } from "react-navigation";
import Ionicons from "react-native-vector-icons/Ionicons";

import { Font } from "./Font";
import { iOSUIKit } from "./typography";
import { TouchHighlighter } from "./TouchHighlighter";

import { PopularListScreen } from "./screens/PopularList";
import { MovieDetailScreen } from "./screens/MovieDetail";
import { InfoScreen } from "./screens/Info";

YellowBox.ignoreWarnings([
  "Warning: isMounted(...) is deprecated",
  "Module RCTImageLoader",
]);

Font.loadAsync({
  ionicons: require("react-native-vector-icons/Fonts/Ionicons.ttf"),
});

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

const baseStackConfig = {
  headerTransitionPreset: Platform.OS === "android" ? "fade-in-place" : "uikit",
  headerMode: "float",
  navigationOptions: ({ navigation }) => ({
    gesturesEnabled: ["dom", "ios"].includes(Platform.OS),
    headerStyle: {
      ...(Platform.OS === "dom"
        ? {
            shadowOpacity: 0,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: "#A7A7AA",
            height: 44,
          }
        : null),
    },
    headerForceInset: {
      top: Platform.OS === "ios" ? "always" : "never",
      bottom: "never",
    },
    headerTitleStyle: [
      Platform.OS === "dom"
        ? {
            flex: 1,
            textAlign: "center",
            padding: 20,
          }
        : {},
    ],
    headerRight: (
      <TouchableOpacity
        style={{ marginRight: 15 }}
        hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
        onPress={() => navigation.navigate("Info")}
      >
        <Ionicons
          color={Platform.OS === "android" ? "black" : "rgb(0, 122, 255)"}
          size={30}
          name="ios-information-circle-outline"
        />
      </TouchableOpacity>
    ),
  }),
};

const PopularStack = StackNavigator(
  {
    PopularList: {
      screen: PopularListScreen,
    },
    PopularDetail: {
      screen: MovieDetailScreen,
      path: "movie/:movieId",
    },
  },
  {
    initialRouteName: "PopularList",
    ...baseStackConfig,
  }
);

const MainStack = StackNavigator(
  {
    Main: {
      screen: PopularStack,
    },
    Info: {
      screen: InfoScreen,
      path: "info",
    },
  },
  {
    initialRouteName: "Main",
    mode: "modal",
    headerMode: "none",
    navigationOptions: {
      gesturesEnabled: true,
    },
  }
);

export default () => (
  <TouchHighlighter disabled={true}>
    <MainStack />
  </TouchHighlighter>
);
