const apiConfig = {
  baseURL: "https://67f4e6ce5ef0893970b5.appwrite.global",
};

const defaultOptions = {
  method: "GET",
  headers: {
    accept: "application/json",
  },
};

/**
 * Converts TMDB-style endpoint into Appwrite-compatible query params
 */
const buildAppwriteURL = (
  path: string,
  queryParams: Record<string, string>,
) => {
  const queryString = new URLSearchParams({
    path,
    ...queryParams,
  }).toString();
  return `?${queryString}`;
};

/**
 * Generic API fetch function
 */
const fetchFromAPI = async (
  path: string,
  queryParams: Record<string, string> = {},
) => {
  try {
    const endpoint = buildAppwriteURL(path, queryParams);
    const response = await fetch(`${apiConfig.baseURL}${endpoint}`, {
      ...defaultOptions,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
};

/**
 * Fetch movies with predefined query parameters
 */
export const fetchMovies = async (path?: string) => {
  return await fetchFromAPI(path ? path : "discover/movie", {
    include_adult: "false",
    include_video: "false",
    language: "en-US",
    page: "1",
    sort_by: "popularity.desc",
  });
};

export const searchMovies = async (query?: string) => {
  return await fetchFromAPI("search/movie", {
    query: query ?? "",
    include_adult: "false",
    include_video: "false",
    language: "en-US",
    page: "1",
    sort_by: "popularity.desc",
  });
};

export const fetchMovieDetails = async (movieID?: string) => {
  return await fetchFromAPI(`movie/${movieID}`, {
    language: "en-US",
  });
};

export const fetchMovieVideos = async (movieID?: string) => {
  return await fetchFromAPI(`movie/${movieID}/videos`, {
    language: "en-US",
  });
};
