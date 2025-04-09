import {
  fetchMovieDetails,
  fetchMovies,
  searchMovies,
} from "@/utils/fetchMovies";
import { useEffect, useState } from "react";

export const useTMDB = (query: string | undefined, variant?: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const getMoviesFetcher = async () => {
    if (query && variant == "search") {
      return await searchMovies(query);
    }
    if (variant == "dashboard-movies") {
      let popularMovies = await fetchMovies("movie/popular");
      let upcomingMovies = await fetchMovies("movie/upcoming");
      let topRatedMovies = await fetchMovies("movie/top_rated");
      return {
        popularMovies: popularMovies?.results,
        upcomingMovies: upcomingMovies?.results,
        topRatedMovies: topRatedMovies?.results
      };

    }
    if (variant === "details") {
      return await fetchMovieDetails(query);
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
        console.log(movies, "movies")
        setData(variant === "details" ? movies : variant == "dashboard-movies" ? movies : movies.results);
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
