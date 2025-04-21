import { Link } from "expo-router";
import { Text, Image, TouchableOpacity, View, StyleSheet } from "react-native";
import { icons } from "@/constants/icons";

const MovieCard = ({
  id,
  poster_path,
  title,
  vote_average,
  release_date,
  searchVarient,
}: Movie) => {
  return (
    <Link href={`/${searchVarient == "tv" ? "tv" : "movie"}/${id}`} asChild>
      <TouchableOpacity style={styles.card}>
        <Image
          source={{
            uri: poster_path
              ? `https://image.tmdb.org/t/p/w500${poster_path}`
              : "https://placehold.co/600x400/1a1a1a/FFFFFF.png",
          }}
          style={styles.image}
          resizeMode="cover"
        />

        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        <View style={styles.ratingContainer}>
          <Image source={icons.star} style={styles.starIcon} />
          <Text style={styles.ratingText}>{Math.round(vote_average / 2)}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.releaseDate}>{release_date?.split("-")[0]}</Text>
          <Text style={styles.movieLabel}>Movie</Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "30%",
  },
  image: {
    width: "100%",
    height: 208, // 52 * 4 = 208 (h-52)
    borderRadius: 8,
  },
  title: {
    fontSize: 14, // text-sm
    fontWeight: "bold",
    color: "white",
    marginTop: 8, // mt-2
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4, // gap-x-1
  },
  starIcon: {
    width: 16, // size-4
    height: 16,
  },
  ratingText: {
    fontSize: 12, // text-xs
    color: "white",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4, // mt-1
  },
  releaseDate: {
    fontSize: 12, // text-xs
    color: "#ABB5DB", // text-light-300
    fontWeight: "500", // font-medium
  },
  movieLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#ABB5DB", // text-light-300
    textTransform: "uppercase",
  },
});

export default MovieCard;
