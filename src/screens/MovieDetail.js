// @flow

import * as React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableHighlight,
  Animated,
  Dimensions,
  Button,
  LayoutAnimation,
} from "react-native";
import FadeIn from "react-native-fade-in-image";
import Ionicons from "react-native-vector-icons/Ionicons";

import { iOSUIKit } from "../typography";
import { imageURL, fetchDetails, fetchCredits } from "../Api";
import { setColor } from "../setColor";

import type { MovieDetails, MovieCredits } from "../Api";

const BACKDROP_SIZE = "w1280";
const POSTER_SIZE = "w500";
const PROFILE_SIZE = "w185";

type Props = {
  navigation: {
    addListener: Function,
    state: {
      params: {
        movieId: number,
        posterPath?: string,
        title?: string,
      },
    },
  },
};

type State = {
  details: ?MovieDetails,
  credits: ?MovieCredits,
  pageHeight: number,
  numCast: number,
};

const Section = props => (
  <React.Fragment>
    <View
      style={{
        width: "100%",
        backgroundColor: "white",
        padding: 10,
        alignItems: "center",
        borderColor: "rgba(0, 0, 0, 0.2)",
        borderTopWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginTop: 10,
        overflow: "hidden",
      }}
    >
      <View style={{ width: "100%", maxWidth: 600 }}>{props.children}</View>
    </View>
  </React.Fragment>
);

export class MovieDetailScreen extends React.Component<Props, State> {
  static navigationOptions = ({ navigation }: any) => ({
    headerTitle: navigation.state.params
      ? navigation.state.params.title
      : "Loading...",
    headerRight: null,
  });

  focusSubscription: *;
  detailsFetcher: *;
  creditsFetcher: *;

  detailsAnim = new Animated.Value(0);
  scrollAnim = new Animated.Value(0);

  state = {
    credits: undefined,
    details: undefined,
    pageHeight: 0,
    numCast: 3,
  };

  handleFocus = async () => {
    const [details, credits] = await Promise.all([
      this.detailsFetcher,
      this.creditsFetcher,
    ]);

    this.setState({ details, credits }, () => {
      Animated.timing(this.detailsAnim, {
        toValue: 1,
        duration: 500,
      }).start();
    });
  };

  componentDidMount() {
    this.focusSubscription = this.props.navigation.addListener(
      "didFocus",
      this.handleFocus
    );

    this.detailsFetcher = this.fetchMovieDetails();
    this.creditsFetcher = this.fetchMovieCredts();

    this.detailsFetcher.then(({ backdrop_path }) => {
      Image.prefetch(imageURL(backdrop_path, BACKDROP_SIZE));
    });
  }

  componentWillUnmount() {
    this.focusSubscription.remove();
  }

  fetchMovieDetails = async () => {
    const { movieId } = this.props.navigation.state.params;
    return await fetchDetails(movieId);
  };

  fetchMovieCredts = async () => {
    const { movieId } = this.props.navigation.state.params;
    return await fetchCredits(movieId);
  };

  handleLayout = (event: *) => {
    this.setState({ pageHeight: event.nativeEvent.layout.height });
  };

  showMoreCast = () => {
    LayoutAnimation.spring();
    this.setState(state => ({ numCast: state.numCast + 3 }));
  };

  renderCover(
    posterPath: string,
    title: string,
    backdropPath: ?string,
    tagline: ?string
  ) {
    return (
      <View
        style={[
          styles.coverContainer,
          {
            backgroundColor: "#c5c5d8",
            height: this.state.pageHeight * 0.33,
          },
        ]}
      >
        {backdropPath ? (
          <View
            style={{
              position: "absolute",
              top: -200,
              left: 0,
              right: 0,
              bottom: 0,
              overflow: "hidden",
            }}
          >
            <Animated.View
              style={{
                top: 100,
                flex: 1,
                transform: [
                  {
                    translateY: this.scrollAnim.interpolate({
                      inputRange: [0, this.state.pageHeight],
                      outputRange: [0, this.state.pageHeight / 2],
                      extrapolateRight: "clamp",
                    }),
                  },
                ],
              }}
            >
              <FadeIn
                style={{ flex: 1 }}
                placeholderStyle={{ backgroundColor: "#c5c5d8" }}
              >
                <Image
                  style={[styles.backdrop]}
                  source={{
                    uri: imageURL(backdropPath, BACKDROP_SIZE),
                  }}
                />
              </FadeIn>
            </Animated.View>
          </View>
        ) : null}
      </View>
    );
  }

  renderPosterAndTitle(posterPath: string, title: string, tagline: ?string) {
    return (
      <View
        style={[
          styles.coverContent,
          {
            top: this.state.pageHeight * 0.33 - imageHeight / 2,
          },
        ]}
      >
        <View style={styles.coverContentInner}>
          <View style={styles.posterShadow}>
            <Image
              style={styles.posterImage}
              source={{
                uri: imageURL(posterPath, POSTER_SIZE),
              }}
            />
          </View>
          <View style={styles.coverContentTextContainer}>
            <Text
              style={[
                iOSUIKit.largeTitleEmphasized,
                { fontSize: 22, lineHeight: 24, letterSpacing: 0 },
              ]}
            >
              {title}
            </Text>
            <Animated.Text
              style={[iOSUIKit.body, { opacity: this.detailsAnim }]}
            >
              {tagline || ""}
            </Animated.Text>
          </View>
        </View>
      </View>
    );
  }

  renderActor(actor: *) {
    return (
      <View key={actor.id} style={styles.actorContainer}>
        <FadeIn style={styles.actorProfileContainer}>
          <Image
            style={styles.actorProfile}
            source={{ uri: imageURL(actor.profile_path, PROFILE_SIZE) }}
          />
        </FadeIn>
        <View>
          <Text style={iOSUIKit.subheadEmphasized}>{actor.name}</Text>
          <Text style={iOSUIKit.footnote}>{actor.character}</Text>
        </View>
      </View>
    );
  }

  render() {
    const { posterPath, movieId, title } = this.props.navigation.state.params;
    const { details, credits } = this.state;

    return (
      <Animated.ScrollView
        style={styles.container}
        onLayout={this.handleLayout}
        scrollEventThrottle={5}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  y: this.scrollAnim,
                },
              },
            },
          ],
          { useNativeDriver: true }
        )}
        contentContainerStyle={styles.scrollContentContainer}
      >
        {(() => {
          if (details && credits) {
            return (
              <React.Fragment>
                {this.renderCover(
                  details.poster_path ? details.poster_path : "",
                  details.title,
                  details.backdrop_path,
                  details.tagline
                )}
                {this.renderPosterAndTitle(
                  details.poster_path ? details.poster_path : "",
                  details.title,
                  details.tagline
                )}
                <Animated.View
                  style={[
                    styles.contentContainer,
                    { opacity: this.detailsAnim },
                  ]}
                >
                  <View
                    style={{ width: "100%", maxWidth: 600, marginBottom: 20 }}
                  >
                    <View style={styles.ratingAndTag}>
                      <Ionicons
                        size={iOSUIKit.bodyEmphasized.fontSize}
                        name="ios-star"
                        style={{ color: setColor(details.vote_average) }}
                      />
                      <Text
                        style={[
                          iOSUIKit.bodyEmphasized,
                          { color: setColor(details.vote_average) },
                        ]}
                      >
                        {" "}
                        {details.vote_average}
                      </Text>
                    </View>
                  </View>

                  {/* DESCRIPTION */}
                  <Section>
                    <View style={styles.overviewContainer}>
                      <Text style={iOSUIKit.body}>{details.overview}</Text>
                    </View>
                  </Section>

                  {/* CAST LIST */}
                  <Section>
                    <View style={{ marginBottom: 10 }}>
                      {credits.cast
                        .slice(0, this.state.numCast)
                        .map(actor => this.renderActor(actor))}
                    </View>
                    {this.state.numCast < credits.cast.length ? (
                      <Button title="Show More" onPress={this.showMoreCast} />
                    ) : null}
                  </Section>

                  <View style={{ height: 400 }} />
                </Animated.View>
              </React.Fragment>
            );
          } else if (posterPath && title) {
            return (
              <React.Fragment>
                {this.renderCover(posterPath, title)}
                {this.renderPosterAndTitle(posterPath, title)}
              </React.Fragment>
            );
          } else {
            return <ActivityIndicator size="large" />;
          }
        })()}
      </Animated.ScrollView>
    );
  }
}

const imageHeight = 200;
const imageWidth = imageHeight * (2 / 3);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContentContainer: {
    flexDirection: "column",
    alignItems: "center",
    minHeight: "100%",
  },
  posterImage: {
    width: imageWidth,
    height: imageHeight,
  },
  posterShadow: {
    shadowColor: "black",
    shadowOpacity: 0.5,
    shadowRadius: 8,
    shadowOffset: { width: 2, height: 2 },
    backgroundColor: "#fff",
    elevation: 7,
  },
  coverContainer: {
    width: "100%",
  },
  coverContent: {
    position: "absolute",
    width: "100%",
    height: imageHeight,
    alignItems: "center",
  },
  coverContentInner: {
    width: "100%",
    height: "100%",
    maxWidth: 600,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  coverContentTextContainer: {
    flex: 1,
    marginTop: imageHeight / 2,
    paddingTop: 10,
    paddingLeft: 15,
  },
  poster: {
    position: "absolute",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  contentContainer: {
    width: "100%",
    marginTop: imageHeight / 2,
    flexDirection: "column",
    alignItems: "center",
  },
  ratingAndTag: {
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: imageWidth,
  },
  overviewContainer: {
    paddingHorizontal: 10,
  },
  actorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    paddingHorizontal: 5,
  },
  actorProfile: {
    width: 50,
    height: 50,
  },
  actorProfileContainer: {
    borderRadius: 25,
    overflow: "hidden",
    marginRight: 10,
  },
});
