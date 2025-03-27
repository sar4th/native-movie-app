import {
  fetchMovieDetails,
  fetchMovies,
  searchMovies,
} from "@/utils/fetchMovies";
import { useEffect, useState } from "react";

export const useTMDB = (query: string, variant?: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const getMoviesFetcher = async () => {
    if (query && !variant) {
      return await searchMovies(query);
    }
    if (variant === "details") {
      return await fetchMovieDetails(query);
    }
    return await fetchMovies();
  };

  useEffect(() => {
    const getMovies = async () => {
      setLoading(true);
      try {
        const movies = await getMoviesFetcher();
        setData(variant === "details" ? movies : movies.results);
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
