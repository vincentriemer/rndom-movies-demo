// @flow

import * as React from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableHighlight,
  Image,
  Text,
  Platform,
  Dimensions,
} from "react-native";
import {
  RecyclerListView,
  DataProvider,
  LayoutProvider,
} from "recyclerlistview";
import FadeIn from "react-native-fade-in-image";

import { setColor } from "../setColor";
import { human } from "../typography";
import { imageURL } from "../Api";

import type { Movie } from "../Api";

const ITEM_HEIGHT = 125;

const LoadingFooter = () => (
  <View style={styles.loadingFooter}>
    <ActivityIndicator />
  </View>
);

const Separator = () => <View style={styles.separator} />;

class Item extends React.Component<*> {
  shouldComponentUpdate(nextProps) {
    return this.props.item.id !== nextProps.item.id;
  }

  render() {
    const { item, handleMoviePress } = this.props;

    return (
      <View>
        <TouchableHighlight
          style={styles.itemContainer}
          onPress={handleMoviePress(item)}
        >
          <View
            style={{
              flex: 1,
              padding: 10,
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "white",
            }}
          >
            <Image
              source={{
                uri: item.poster_path ? imageURL(item.poster_path, "w500") : "",
              }}
              style={styles.itemImage}
            />
            <View
              style={{
                flexGrow: 0,
              }}
            >
              <View>
                <Text style={human.headline} numberOfLines={1}>
                  {item.title}
                </Text>
              </View>
              <Text style={human.body}>
                {item.release_date.split("-")[0]}
                {"   "}
                <Text style={{ color: setColor(item.vote_average) }}>
                  {item.vote_average}
                </Text>
              </Text>
            </View>
          </View>
        </TouchableHighlight>
        <Separator />
      </View>
    );
  }
}

type Props = {
  movies: Movie[],
  loading: boolean,
  headerComponent?: React.Node,
  onMoviePress: (movie: Movie) => void,
  onEndReached: () => void,
};

export class MovieList extends React.Component<Props> {
  layoutProvider = new LayoutProvider(
    index => 1,
    (type: number, dim: { width: number, height: number }) => {
      const { width } = Dimensions.get("window");
      dim.width = width;
      dim.height = ITEM_HEIGHT + StyleSheet.hairlineWidth;
    }
  );

  constructor(props: Props) {
    super(props);
  }

  extractKeyFromItem = (item: Movie, index: number): string =>
    `${item.id}${index}`;

  handleMoviePress = (movie: Movie) => () => {
    const { onMoviePress } = this.props;
    onMoviePress(movie);
  };

  getItemLayout = (data: any, index: number) => ({
    length: ITEM_HEIGHT,
    offset: (ITEM_HEIGHT + StyleSheet.hairlineWidth) * index,
    index,
  });

  renderItem = (type: number, item: Movie) => (
    <Item type={type} item={item} handleMoviePress={this.handleMoviePress} />
  );

  render() {
    const { movies, loading, onEndReached } = this.props;

    // $FlowFixMe
    if (movies.getSize() === 0) {
      return <LoadingFooter />;
    }

    return (
      <RecyclerListView
        layoutProvider={this.layoutProvider}
        dataProvider={movies}
        rowRenderer={this.renderItem}
        onEndReached={onEndReached}
        onEndReachedThreshold={ITEM_HEIGHT * 5}
        renderFooter={loading ? LoadingFooter : null}
        canChangeSize={true}
        renderAheadOffset={ITEM_HEIGHT * 4}
      />
    );
  }
}

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
  },
  loadingFooter: {
    height: ITEM_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
  },
  itemImage: {
    width: 70,
    height: 70 / (2 / 3),
    marginRight: 10,
  },
});
