const apiConfig = {
  baseURL: "https://api.themoviedb.org/3",
  token: process.env.EXPO_PUBLIC_API_KEY,
};

const defaultOptions = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${apiConfig.token}`,
  },
};

/**
 * Generic API fetch function
 */
const fetchFromAPI = async (endpoint: string, options = {}) => {
  try {
    const response = await fetch(`${apiConfig.baseURL}${endpoint}`, {
      ...defaultOptions,
      ...options,
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
export const fetchMovies = async (query?: string) => {
  return await fetchFromAPI(
    `/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc`,
  );
};

export const searchMovies = async (query?: string) => {
  return await fetchFromAPI(
    `/search/movie?query=${query ? query : ""}&include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc`,
  );
};

export const fetchMovieDetails = async (movieID?: string) => {
  return await fetchFromAPI(`/movie/${movieID}?language=en-US`);
};
