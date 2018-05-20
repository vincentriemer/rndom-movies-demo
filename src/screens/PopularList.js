// @flow

import * as React from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableHighlight,
} from "react-native";
import {
  RecyclerListView,
  DataProvider,
  LayoutProvider,
} from "recyclerlistview";

import { human } from "../typography";
import { discover, imageURL } from "../Api";
import { setColor } from "../setColor";
import { MovieList } from "../components/MovieList";

import type { Navigation } from "react-navigation";
import type { Movie } from "../Api";

type Props = {
  navigation: Navigation,
};

type State = {
  currentPage: number,
  movies: *,
  loading: boolean,
};

export class PopularListScreen extends React.Component<Props, State> {
  static navigationOptions = {
    title: "Movies",
  };

  dataProvider: *;

  constructor(props: Props) {
    super(props);

    this.dataProvider = new DataProvider(
      (r1: Movie, r2: Movie) => r1.id !== r2.id
    );

    this.state = {
      currentPage: 0,
      movies: this.dataProvider.cloneWithRows([]),
      loading: false,
    };
  }

  componentDidMount() {
    this.fetchNextPage();
  }

  async fetchNextPage() {
    const { currentPage, loading } = this.state;

    if (!loading) {
      this.setState(() => ({ loading: true }));
      const res = await discover(currentPage + 1);

      this.setState(state => ({
        loading: false,
        currentPage: currentPage + 1,
        movies: this.dataProvider.cloneWithRows(
          state.movies.getAllData().concat(res.results)
        ),
      }));
    }
  }

  onEndReached = () => {
    this.fetchNextPage();
  };

  handleMoviePress = (item: Movie) => {
    this.props.navigation.navigate("PopularDetail", {
      movieId: item.id,
      posterPath: item.poster_path,
      title: item.title,
      backdropPath: item.backdrop_path,
    });
  };

  render() {
    const { loading, movies } = this.state;
    return (
      <View style={styles.listContainer}>
        <MovieList
          loading={loading}
          movies={movies}
          onEndReached={this.onEndReached}
          onMoviePress={this.handleMoviePress}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
  },
});
