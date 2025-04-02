import { images } from "@/constants/images";
import { useTMDB } from "@/hooks/useGetMovies";
import { useLocalSearchParams } from "expo-router";
import { Image, Text, View, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Poster Component
const Poster = ({ posterPath }: { posterPath?: string }) => {
  if (!posterPath) return null;
  return (
    <Image
      source={{ uri: `https://image.tmdb.org/t/p/w500${posterPath}` }}
      resizeMode="cover"
      style={styles.poster}
    />
  );
};

// Title and Info Component
const TitleAndInfo = ({
  title,
  releaseDate,
  runtime,
}: {
  title?: string;
  releaseDate?: string;
  runtime?: number;
}) => {
  const releaseYear = releaseDate ? releaseDate.split("-")[0] : "N/A";
  const runtimeFormatted = runtime
    ? `${Math.floor(runtime / 60)}h ${runtime % 60}m`
    : "N/A";

  return (
    <View style={styles.titleInfoContainer}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.infoRow}>
        <Text style={styles.infoText}>{releaseYear}</Text>
        <Text style={[styles.infoText, styles.runtimeText]}>
          {runtimeFormatted}
        </Text>
      </View>
    </View>
  );
};

// Stats Component
const Stats = ({
  voteAverage,
  voteCount,
  popularity,
}: {
  voteAverage?: number;
  voteCount?: number;
  popularity?: number;
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

// Overview Component
const Overview = ({ overview }: { overview?: string }) => (
  <View style={styles.overviewContainer}>
    <Text style={styles.overviewTitle}>Overview</Text>
    <Text style={styles.overviewText}>{overview}</Text>
  </View>
);

// Details Component
const Details = ({
  releaseDate,
  status,
}: {
  releaseDate?: string;
  status?: string;
}) => (
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

// Genres Component
const Genres = ({ genres }: { genres: any[] }) => {
  return (
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
};

// Countries Component
const Countries = ({ countries }: { countries: any[] }) => {
  return (
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
};

// Budget Component
const Budget = ({ data }: { data: any }) => {
  return (
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
};

const ProductionCompanies = ({ companies }: { companies: any[] }) => {
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

// Main MovieDetails Component
const MovieDetails = () => {
  const { id } = useLocalSearchParams();
  const { data, loading, error } = useTMDB(id, "details");

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
      <Poster posterPath={data?.poster_path} />
      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <TitleAndInfo
          title={data?.original_title}
          releaseDate={data?.release_date}
          runtime={data?.runtime}
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
    height: 400,
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
