import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { useTMDB } from "@/hooks/useGetMovies";
import { addMovieToFav, deleteMovie, getSavedMovies } from "@/utils/appwrite";
import { getCurrentUser } from "@/utils/auth";
import { useLocalSearchParams, useRouter } from "expo-router";
import NetInfo from "@react-native-community/netinfo";
import React, { useEffect, useRef, useState } from "react";
import YoutubePlayer from "react-native-youtube-iframe";
import * as ScreenOrientation from "expo-screen-orientation";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { fetchMovies, fetchMovieVideos } from "@/utils/fetchMovies";
/* ==================== Poster Component ==================== */
interface PosterProps {
  posterPath?: string;
  videoId: string;
}

const Poster: React.FC<PosterProps> = ({ posterPath, videoId }) => {
  if (!posterPath) return null;
  const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";
  return (
    <>
      {videoId ? (
        <VideoPlayer videoId={videoId ?? videoId} />
      ) : (
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w500${posterPath}` }}
          style={styles.poster}
          placeholder={{ blurhash }}
          contentFit="cover"
          transition={1000}
        />
      )}
    </>
  );
};
const VideoPlayer = ({ videoId }) => {
  const playerRef = useRef(null);

  const onFullScreenChange = async (isFullscreen: boolean) => {
    if (isFullscreen) {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE,
      );
    } else {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP,
      );
    }
  };
  return (
    <YoutubePlayer
      height={250}
      play={true}
      forceAndroidAutoplay
      videoId={videoId}
      onFullScreenChange={onFullScreenChange}
      mute={true}
    />
  );
};
/* ==================== Title and Info Component ==================== */
interface TitleAndInfoProps {
  title?: string;
  releaseDate?: string;
  runtime?: number;
  onAddToWishList: VoidFunction;
  isThisSaved: boolean;
}

const TitleAndInfo: React.FC<TitleAndInfoProps> = ({
  title,
  releaseDate,
  runtime,
  onAddToWishList,
  isThisSaved,
}) => {
  const releaseYear = releaseDate ? releaseDate.split("-")[0] : "N/A";
  const runtimeFormatted = runtime
    ? `${Math.floor(runtime / 60)}h ${runtime % 60}m`
    : "N/A";

  return (
    <View style={styles.titleInfoContainer}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={onAddToWishList}>
          <Image
            source={isThisSaved ? icons.redHeart : icons.heartIconWhite}
            resizeMode="cover"
            style={styles.wishListIcon}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoText}>{releaseYear}</Text>
        <Text style={[styles.infoText, styles.runtimeText]}>
          {runtimeFormatted}
        </Text>
      </View>
    </View>
  );
};

/* ==================== Stats Component ==================== */
interface StatsProps {
  voteAverage?: number;
  voteCount?: number;
  popularity?: number;
}

const Stats: React.FC<StatsProps> = ({
  voteAverage,
  voteCount,
  popularity,
}) => {
  return (
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <Image width={12} height={12} source={images.starIcon} />
        <Text style={styles.statText}>
          {voteAverage}/({voteCount} votes)
        </Text>
      </View>
      <View style={styles.statItem}>
        <Image width={12} height={12} source={images.arrowIcon} />
        <Text style={styles.statText}>{Math.round(popularity || 0)}</Text>
      </View>
    </View>
  );
};

/* ==================== Overview Component ==================== */
interface OverviewProps {
  overview?: string;
}

const Overview: React.FC<OverviewProps> = ({ overview }) => (
  <View style={styles.overviewContainer}>
    <Text style={styles.overviewTitle}>Overview</Text>
    <Text style={styles.overviewText}>{overview}</Text>
  </View>
);

/* ==================== Details Component ==================== */
interface DetailsProps {
  releaseDate?: string;
  status?: string;
}

const Details: React.FC<DetailsProps> = ({ releaseDate, status }) => (
  <View style={styles.detailsRow}>
    <View style={styles.detailItem}>
      <Text style={styles.detailLabel}>Release Date</Text>
      <Text style={styles.detailValue}>{releaseDate}</Text>
    </View>
    <View style={styles.detailItem}>
      <Text style={styles.detailLabel}>Status</Text>
      <Text style={styles.detailValue}>{status}</Text>
    </View>
  </View>
);

/* ==================== Genres Component ==================== */
interface GenresProps {
  genres: any[];
}

const Genres: React.FC<GenresProps> = ({ genres }) => (
  <View style={styles.sectionContainer}>
    <Text style={styles.detailLabel}>Genres</Text>
    <View style={styles.rowContainer}>
      {genres?.map((item, index) => (
        <View key={index} style={styles.genreContainer}>
          <Text style={styles.genreText}>{item.name}</Text>
        </View>
      ))}
    </View>
  </View>
);

/* ==================== Countries Component ==================== */
interface CountriesProps {
  countries: any[];
}

const Countries: React.FC<CountriesProps> = ({ countries }) => (
  <View style={styles.sectionContainer}>
    <Text style={styles.detailLabel}>Countries</Text>
    <View style={styles.rowContainer}>
      {countries?.map((item, index) => (
        <View key={index} style={styles.genreContainer}>
          <Text style={styles.genreText}>{item.name}</Text>
        </View>
      ))}
    </View>
  </View>
);

/* ==================== Budget Component ==================== */
interface BudgetProps {
  data: any;
}

const Budget: React.FC<BudgetProps> = ({ data }) => (
  <View style={styles.budgetContainer}>
    <View>
      <Text style={styles.detailLabel}>Budget</Text>
      <Text style={styles.detailValue}>
        {Math.round((data?.budget ?? 0) / 1_000_000)} million
      </Text>
    </View>
    <View>
      <Text style={styles.detailLabel}>Revenue</Text>
      <Text style={styles.detailValue}>
        {Math.round((data?.revenue ?? 0) / 1_000_000)} million
      </Text>
    </View>
  </View>
);

/* ==================== Production Companies Component ==================== */
interface ProductionCompaniesProps {
  companies: any[];
}

const ProductionCompanies: React.FC<ProductionCompaniesProps> = ({
  companies,
}) => {
  if (!companies?.length) return null;
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.detailLabel}>Production Companies</Text>
      <Text style={styles.detailValue}>
        {companies.map((company, index) => {
          const isLast = index === companies.length - 1;
          return `${company.name}${!isLast ? " · " : ""}`;
        })}
      </Text>
    </View>
  );
};

/* ==================== Main MovieDetails Component ==================== */
const MovieDetails: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [user, setUser] = useState<any>(null);
  const [isSaved, setIsSaved] = useState(false);

  const [movieTrailer, setMovieTrailer] = useState("");

  const [savedMovie, setSavedMovie] = useState();

  useEffect(() => {
    const fetchUserAndCheckMovie = async () => {
      try {
        const movieTrailer = await fetchMovieVideos(id);
        const movieVideo = movieTrailer?.results?.find(
          (video) => video.type == "Trailer" || video.type == "Teaser",
        );
        setMovieTrailer(movieVideo?.key);

        const currentUser = await getCurrentUser();
        setUser(currentUser);

        const targetId = currentUser?.targets?.[0]?.$id;
        if (!targetId) return;

        const savedMovies = await getSavedMovies(targetId);
        const isSavedMovie = savedMovies?.some((movie) => movie.id === id);

        const savedMovie = savedMovies?.find((movie) => movie.id === id);

        if (isSavedMovie) {
          setIsSaved(true);
          setSavedMovie(savedMovie);
        }
      } catch (error) {
        console.error("Failed to fetch user or movies:", error);
      }
    };

    fetchUserAndCheckMovie();
  }, []);

  const { data, loading, error } = useTMDB(id, "details");
  const [isLoading, setIsLoading] = useState(false);
  async function handleAddToWishListClick() {
    if (isLoading) return;
    setIsLoading(true);
    if (!user) {
      router.push("/profile");
    }
    if (!data) return;
    if (isSaved) {
      setIsLoading(true);
      const response = await deleteMovie(savedMovie?.$id);
      if (Object.values(response).length > 0) {
        setIsLoading(false);
        setIsSaved(false);
        return;
      }
    }
    const payload = {
      userid: user.targets[0].$id,
      title: data?.original_title,
      poster_path: data?.poster_path,
      id: id,
      vote_average: String(data?.vote_average),
      release_date: data?.release_date,
    };
    try {
      setIsLoading(true);
      const response = await addMovieToFav(payload);
      if (Object.values(response).length > 0) {
        setIsLoading(false);
        setIsSaved(true);
      }
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <Poster posterPath={data?.poster_path} videoId={movieTrailer} />

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <TitleAndInfo
          title={data?.original_title}
          releaseDate={data?.release_date}
          runtime={data?.runtime}
          onAddToWishList={handleAddToWishListClick}
          isThisSaved={isSaved}
        />
        <Stats
          voteAverage={data?.vote_average}
          voteCount={data?.vote_count}
          popularity={data?.popularity}
        />
        <Overview overview={data?.overview} />
        <Details releaseDate={data?.release_date} status={data?.status} />
        <Genres genres={data?.genres} />
        <Countries countries={data?.production_countries} />
        <Budget data={data} />
        <ProductionCompanies companies={data?.production_companies} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#030014",
  },
  loadingText: {
    color: "white",
    alignSelf: "center",
    marginTop: 20,
  },
  errorText: {
    color: "red",
    alignSelf: "center",
    marginTop: 20,
  },
  poster: {
    width: "100%",
    height: 250,
  },
  wishListIcon: {
    width: 30,
    height: 30,
  },
  content: {
    paddingTop: 17,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  titleInfoContainer: {
    marginBottom: 10,
  },
  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    color: "white",
    fontSize: 14,
    fontWeight: "400",
    paddingTop: 17,
    paddingBottom: 6,
  },
  runtimeText: {
    paddingLeft: 20,
  },
  statsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  statItem: {
    backgroundColor: "#221F3D",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginRight: 10,
  },
  statText: {
    color: "white",
    fontSize: 14,
    fontWeight: "400",
    marginLeft: 5,
  },
  overviewContainer: {
    marginTop: 30,
  },
  overviewTitle: {
    color: "#A8B5DB",
    fontSize: 12,
    fontWeight: "400",
    marginBottom: 4,
  },
  overviewText: {
    color: "white",
    fontSize: 14,
    fontWeight: "400",
  },
  detailsRow: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailItem: {},
  detailLabel: {
    color: "#A8B5DB",
    fontSize: 12,
    fontWeight: "400",
    marginBottom: 4,
  },
  detailValue: {
    color: "#D6C7FF",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  sectionContainer: {
    marginTop: 30,
  },
  rowContainer: {
    flexDirection: "row",
  },
  genreContainer: {
    backgroundColor: "#221F3D",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginRight: 10,
  },
  genreText: {
    color: "white",
  },
  budgetContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
});

export default MovieDetails;
