import type {
  TMDBMovie,
  TMDBTVShow,
  TMDBMovieDetails,
  TMDBTVDetails,
  TMDBPaginatedResponse,
  TMDBVideos,
  TMDBCredits,
  ContentItem,
  ContentDetails,
  ContentType,
} from '../types';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export function getImageUrl(path: string | null, size: 'w200' | 'w300' | 'w500' | 'w780' | 'original' = 'w500'): string | null {
  if (!path) return null;
  return `${IMAGE_BASE_URL}/${size}${path}`;
}

async function fetchTMDB<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const searchParams = new URLSearchParams({
    api_key: API_KEY,
    language: 'uk-UA',
    ...params,
  });

  const response = await fetch(`${BASE_URL}${endpoint}?${searchParams}`);

  if (!response.ok) {
    throw new Error(`TMDB API Error: ${response.status}`);
  }

  return response.json();
}

function mapMovieToContent(movie: TMDBMovie): ContentItem {
  return {
    id: movie.id,
    type: 'movie',
    title: movie.title,
    originalTitle: movie.original_title,
    overview: movie.overview,
    posterPath: getImageUrl(movie.poster_path, 'w500'),
    backdropPath: getImageUrl(movie.backdrop_path, 'original'),
    releaseDate: movie.release_date,
    voteAverage: movie.vote_average,
    voteCount: movie.vote_count,
    popularity: movie.popularity,
    genreIds: movie.genre_ids,
    originalLanguage: movie.original_language,
  };
}

function mapTVToContent(tv: TMDBTVShow): ContentItem {
  return {
    id: tv.id,
    type: 'tv',
    title: tv.name,
    originalTitle: tv.original_name,
    overview: tv.overview,
    posterPath: getImageUrl(tv.poster_path, 'w500'),
    backdropPath: getImageUrl(tv.backdrop_path, 'original'),
    releaseDate: tv.first_air_date,
    voteAverage: tv.vote_average,
    voteCount: tv.vote_count,
    popularity: tv.popularity,
    genreIds: tv.genre_ids,
    originalLanguage: tv.original_language,
  };
}

export async function fetchPopularMovies(page = 1): Promise<ContentItem[]> {
  const data = await fetchTMDB<TMDBPaginatedResponse<TMDBMovie>>('/movie/popular', { page: page.toString() });
  return data.results.map(mapMovieToContent);
}

export async function fetchPopularTV(page = 1): Promise<ContentItem[]> {
  const data = await fetchTMDB<TMDBPaginatedResponse<TMDBTVShow>>('/tv/popular', { page: page.toString() });
  return data.results.map(mapTVToContent);
}

export async function fetchTopRatedMovies(page = 1): Promise<ContentItem[]> {
  const data = await fetchTMDB<TMDBPaginatedResponse<TMDBMovie>>('/movie/top_rated', { page: page.toString() });
  return data.results.map(mapMovieToContent);
}

export async function fetchTopRatedTV(page = 1): Promise<ContentItem[]> {
  const data = await fetchTMDB<TMDBPaginatedResponse<TMDBTVShow>>('/tv/top_rated', { page: page.toString() });
  return data.results.map(mapTVToContent);
}

export async function fetchByGenre(type: ContentType, genreId: number, page = 1): Promise<ContentItem[]> {
  const data = await fetchTMDB<TMDBPaginatedResponse<TMDBMovie | TMDBTVShow>>(`/discover/${type}`, {
    with_genres: genreId.toString(),
    page: page.toString(),
    sort_by: 'popularity.desc',
  });
  return data.results.map(type === 'movie' ? mapMovieToContent : mapTVToContent);
}

export async function fetchByKeyword(keyword: string, page = 1): Promise<ContentItem[]> {
  const movieData = await fetchTMDB<TMDBPaginatedResponse<TMDBMovie>>('/search/movie', {
    query: keyword,
    page: page.toString(),
  });

  const tvData = await fetchTMDB<TMDBPaginatedResponse<TMDBTVShow>>('/search/tv', {
    query: keyword,
    page: page.toString(),
  });

  const movies = movieData.results.map(mapMovieToContent);
  const tvShows = tvData.results.map(mapTVToContent);

  return [...movies, ...tvShows].sort((a, b) => b.popularity - a.popularity);
}

export async function searchContent(query: string, page = 1): Promise<ContentItem[]> {
  const data = await fetchTMDB<TMDBPaginatedResponse<TMDBMovie | TMDBTVShow>>>('/search/multi', {
    query,
    page: page.toString(),
  });

  return data.results
    .filter((item) => 'title' in item || 'name' in item)
    .filter((item) => item.poster_path)
    .map((item) => {
      if ('title' in item) {
        return mapMovieToContent(item as TMDBMovie);
      }
      return mapTVToContent(item as TMDBTVShow);
    });
}

export async function fetchMovieDetails(id: number): Promise<ContentDetails> {
  const [details, credits, videos] = await Promise.all([
    fetchTMDB<TMDBMovieDetails>(`/movie/${id}`),
    fetchTMDB<TMDBCredits>(`/movie/${id}/credits`),
    fetchTMDB<TMDBVideos>(`/movie/${id}/videos`),
  ]);

  return {
    id: details.id,
    type: 'movie',
    title: details.title,
    originalTitle: details.original_title,
    overview: details.overview,
    posterPath: getImageUrl(details.poster_path, 'w500'),
    backdropPath: getImageUrl(details.backdrop_path, 'original'),
    releaseDate: details.release_date,
    voteAverage: details.vote_average,
    voteCount: details.vote_count,
    popularity: details.popularity,
    genreIds: details.genres.map((g) => g.id),
    originalLanguage: details.original_language,
    runtime: details.runtime,
    status: details.status,
    tagline: details.tagline,
    genres: details.genres,
    credits,
    videos: videos.results.filter((v) => v.site === 'YouTube'),
    productionCompanies: details.production_companies.map((c) => ({
      id: c.id,
      name: c.name,
      logoPath: getImageUrl(c.logo_path, 'w200'),
    })),
  };
}

export async function fetchTVDetails(id: number): Promise<ContentDetails> {
  const [details, credits, videos] = await Promise.all([
    fetchTMDB<TMDBTVDetails>(`/tv/${id}`),
    fetchTMDB<TMDBCredits>(`/tv/${id}/credits`),
    fetchTMDB<TMDBVideos>(`/tv/${id}/videos`),
  ]);

  return {
    id: details.id,
    type: 'tv',
    title: details.name,
    originalTitle: details.original_name,
    overview: details.overview,
    posterPath: getImageUrl(details.poster_path, 'w500'),
    backdropPath: getImageUrl(details.backdrop_path, 'original'),
    releaseDate: details.first_air_date,
    voteAverage: details.vote_average,
    voteCount: details.vote_count,
    popularity: details.popularity,
    genreIds: details.genres.map((g) => g.id),
    originalLanguage: details.original_language,
    episodeRunTime: details.episode_run_time,
    numberOfSeasons: details.number_of_seasons,
    numberOfEpisodes: details.number_of_episodes,
    status: details.status,
    tagline: details.tagline,
    genres: details.genres,
    credits,
    videos: videos.results.filter((v) => v.site === 'YouTube'),
    productionCompanies: details.production_companies.map((c) => ({
      id: c.id,
      name: c.name,
      logoPath: getImageUrl(c.logo_path, 'w200'),
    })),
  };
}

export async function fetchContentDetails(id: number, type: ContentType): Promise<ContentDetails> {
  return type === 'movie' ? fetchMovieDetails(id) : fetchTVDetails(id);
}

export async function getTrailerUrl(id: number, type: ContentType): Promise<string | null> {
  const videos = await fetchTMDB<TMDBVideos>(`/${type}/${id}/videos`);
  const trailer = videos.results.find(
    (v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
  );
  return trailer ? `https://www.youtube.com/embed/${trailer.key}` : null;
}

export async function fetchPopularAnimations(page = 1): Promise<ContentItem[]> {
  const data = await fetchTMDB<TMDBPaginatedResponse<TMDBMovie>>>('/discover/movie', {
    with_genres: '16',
    page: page.toString(),
    sort_by: 'popularity.desc',
  });
  return data.results.map(mapMovieToContent);
}

export async function fetchTopCartoons(page = 1): Promise<ContentItem[]> {
  const data = await fetchTMDB<TMDBPaginatedResponse<TMDBMovie>>>('/discover/movie', {
    with_genres: '16',
    page: page.toString(),
    sort_by: 'vote_average.desc',
    'vote_count.gte': '100',
  });
  return data.results.map(mapMovieToContent);
}

export async function fetchKidsContent(page = 1): Promise<ContentItem[]> {
  const data = await fetchTMDB<TMDBPaginatedResponse<TMDBMovie>>>('/discover/movie', {
    with_genres: '10751',
    page: page.toString(),
    sort_by: 'popularity.desc',
  });
  return data.results.map(mapMovieToContent);
}
