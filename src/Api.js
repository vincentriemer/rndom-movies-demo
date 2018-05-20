// @flow

export type Movie = {
  poster_path: ?string,
  adult: boolean,
  overview: string,
  release_date: string,
  genre_ids: number[],
  id: number,
  original_title: string,
  original_language: string,
  title: string,
  backdrop_path: ?string,
  popularity: number,
  vote_count: number,
  video: boolean,
  vote_average: number,
};

export type MovieDetails = Movie & {
  genres: { id: number, name: string }[],
  homepage: ?string,
  overview: ?string,
  production_companies: {
    name: string,
    id: number,
    logo_path: string,
  },
  runtime: ?number,
  tagline: ?string,
};

export type MovieCredits = {
  id: number,
  cast: {
    id: number,
    cast_id: number,
    character: string,
    credit_id: string,
    name: string,
    order: number,
    profile_path: ?string,
  }[],
  crew: {
    id: number,
    credit_id: string,
    department: string,
    job: string,
    name: string,
    profile_path: ?string,
  }[],
};

export type PagedResponse<T> = {
  page: number,
  results: T[],
  total_results: number,
  total_pages: number,
};

const BASE_URL = "https://movie-demo-api.now.sh/3";

const suchFetch = <T>(
  path: string,
  fetchOpts: { credentials?: string } = {},
  params: { [string]: string | number } = {}
): Promise<T> => {
  const query = Object.keys(params)
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(`${params[k]}`)}`)
    .join("&");

  const url = `${BASE_URL}${path}?${query}`;

  return fetch(url, fetchOpts)
    .then(res => res.json())
    .catch(ex => console.log("Fetch Exception", ex));
};

export const discover = async (page: number = 1) => {
  const response: PagedResponse<Movie> = await suchFetch(
    `/movie/popular`,
    { credentials: "omit" },
    { page }
  );

  return response;
};

export const fetchDetails = async (id: number) => {
  const response: MovieDetails = await suchFetch(`/movie/${id}`, {
    credentials: "omit",
  });

  return response;
};

export const fetchCredits = async (id: number) => {
  const response: MovieCredits = await suchFetch(`/movie/${id}/credits`, {
    credentials: "omit",
  });

  return response;
};

const BASE_IMAGE_URL = "https://image.tmdb.org/t/p";

export const imageURL = (path: string, size: string) =>
  `${BASE_IMAGE_URL}/${size}/${path}`;
