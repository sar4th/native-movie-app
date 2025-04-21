import {
  fetchMovieDetails,
  fetchShowDetails,
  fetchMovies,
  fetchShows,
  searchMovies,
  searchTvShows,
} from "@/utils/fetchMovies";
import { useEffect, useState } from "react";

export const useTMDB = (
  query: string | undefined,
  variant?: string,
  page?: string,
) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const getMoviesFetcher = async () => {
    if (query && variant == "search") {
      if (page == "tv") {
        return await searchTvShows(query);
      }
      return await searchMovies(query);
    }
    if (variant == "dashboard-movies") {
      let popularMovies = await fetchMovies("movie/popular");
      let upcomingMovies = await fetchMovies("movie/upcoming");
      let topRatedMovies = await fetchMovies("movie/top_rated");
      return {
        popularMovies: popularMovies?.results,
        upcomingMovies: upcomingMovies?.results,
        topRatedMovies: topRatedMovies?.results,
      };
    }
    if (variant == "dashBoard-tvShows") {
      let popularShows = await fetchShows("tv/popular");
      let upcomingShows = await fetchShows("tv/on_the_air");
      let topRatedShows = await fetchShows("tv/top_rated");

      return {
        popularShows: popularShows?.results,
        upcomingShows: upcomingShows?.results,
        topRatedShows: topRatedShows?.results,
      };
    }
    if (variant === "details") {
      return await fetchMovieDetails(query);
    }
    if (variant == "tvShowDetails") {
      return await fetchShowDetails(query);
    }
    if (!query && variant == "search") {
      return await fetchMovies();
    }
  };

  useEffect(() => {
    const getMovies = async () => {
      setLoading(true);
      try {
        const movies = await getMoviesFetcher();
        setData(
          variant === "details" || variant == "tvShowDetails"
            ? movies
            : variant === "dashboard-movies" || variant === "dashBoard-tvShows"
              ? movies
              : movies.results,
        );
      } catch (err) {
        setError("Failed to fetch movies");
        console.error("Error fetching movies:", err);
      } finally {
        setLoading(false);
      }
    };

    getMovies();
  }, [query, variant]);

  return { data, loading, error };
};
