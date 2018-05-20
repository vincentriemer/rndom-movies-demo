// @flow

import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  TouchableOpacity,
  Linking,
  Animated,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import FadeIn from "react-native-fade-in-image";
import { iOSUIKit } from "../typography";

const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);

type IndicatorProps = {
  addNavigationListener: Function,
};

type IndicatorState = {
  pulseAnim: Animated.Value,
  revealAnim: Animated.Value,
};

class SwipeDownIndicator extends React.Component<
  IndicatorProps,
  IndicatorState
> {
  didFocusSubscription: *;

  state = {
    pulseAnim: new Animated.Value(0),
    revealAnim: new Animated.Value(0),
  };

  componentDidMount() {
    const { revealAnim, pulseAnim } = this.state;

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 750,
          useNativeDriver: true,
        }),
      ])
    ).start();

    this.didFocusSubscription = this.props.addNavigationListener(
      "didFocus",
      () => {
        Animated.sequence([
          Animated.timing(revealAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start();
      }
    );
  }

  componentWillUnmount() {
    this.didFocusSubscription.remove();
  }

  render() {
    const { revealAnim, pulseAnim } = this.state;
    return (
      <Animated.View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          opacity: revealAnim,
        }}
      >
        <AnimatedIcon
          style={{
            opacity: pulseAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.1, 0.5],
            }),
            transform: [
              {
                translateY: pulseAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 25],
                }),
              },
            ],
          }}
          size={40}
          name="ios-arrow-down"
        />
      </Animated.View>
    );
  }
}

export const InfoScreen = (props: *) => (
  <View style={styles.screen}>
    <View style={styles.indicatorWrapper}>
      <SwipeDownIndicator
        addNavigationListener={props.navigation.addListener}
      />
    </View>
    <Text style={iOSUIKit.largeTitleEmphasized}>Movie Demo</Text>
    <Text style={iOSUIKit.bodyEmphasized}>
      Made with ☕️ by{" "}
      <Text
        style={styles.twitterTag}
        onPress={() => Linking.openURL("https://twitter.com/vincentriemer")}
      >
        @vincentriemer
      </Text>
    </Text>
    <TouchableOpacity
      onPress={() => Linking.openURL("https://www.themoviedb.org")}
    >
      <FadeIn placeholderStyle={{ backgroundColor: "white" }}>
        <Image
          style={styles.tmdbCredit}
          source={require("../assets/tmdb.png")}
        />
      </FadeIn>
    </TouchableOpacity>
    <View style={styles.dismissButton}>
      <Button title="Dismiss" onPress={() => props.navigation.goBack()} />
    </View>
  </View>
);

const IMAGE_WIDTH = 200;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  indicatorWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  tmdbCredit: {
    width: IMAGE_WIDTH,
    height: 161 / 408 * IMAGE_WIDTH,
    marginTop: 20,
    tintColor: "black",
  },
  dismissButton: {
    marginTop: 15,
  },
  twitterTag: {
    textDecorationLine: "underline",
  },
});
