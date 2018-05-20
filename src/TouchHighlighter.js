// @flow

import * as React from "react";
import {
  Platform,
  View,
  Animated,
  StyleSheet,
  YellowBox,
  UIManager,
  TouchableOpacity,
  PanResponder,
  DeviceEventEmitter,
} from "react-native";

type Props = { children: React.Node, disabled?: boolean };
type State = {
  touchCenter: ?{ x: number, y: number },
  displayAnim: Animated.Value,
  positionAnim: Animated.ValueXY,
};

const touchSize = 60;
const showDuration = 250;

export class TouchHighlighter extends React.Component<Props, State> {
  state = {
    touchCenter: undefined,
    displayAnim: new Animated.Value(0),
    positionAnim: new Animated.ValueXY({ x: 0, y: 0 }),
  };

  componentDidMount() {
    this.state.positionAnim.setOffset({ x: -touchSize / 2, y: -touchSize / 2 });
  }

  updatePositionFromEvent = (evt: *) => {
    const { pageX: x, pageY: y } = evt.nativeEvent;
    this.state.positionAnim.setValue({ x, y });
  };

  handleTouchStart = (evt: *) => {
    Animated.spring(this.state.displayAnim, {
      toValue: 1,
      duration: showDuration,
    }).start();
    this.updatePositionFromEvent(evt);
  };
  handleTouchMove = (evt: *) => {
    this.updatePositionFromEvent(evt);
  };
  handleTouchEnd = (evt: *) => {
    Animated.spring(this.state.displayAnim, {
      toValue: 0,
      duration: showDuration,
    }).start();
    this.updatePositionFromEvent(evt);
  };

  render() {
    const { children, disabled } = this.props;
    const { positionAnim, displayAnim } = this.state;

    if (disabled) {
      return children;
    }

    return (
      <View
        style={styles.container}
        onTouchStart={this.handleTouchStart}
        onTouchMove={this.handleTouchMove}
        onTouchEnd={this.handleTouchEnd}
      >
        {children}
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          <Animated.View
            style={[
              styles.touch,
              {
                opacity: displayAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.5],
                }),
                transform: positionAnim.getTranslateTransform(),
              },
            ]}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  touch: {
    width: touchSize,
    height: touchSize,
    backgroundColor: "black",
    borderRadius: touchSize / 2,
  },
});
