import { useTMDB } from "@/hooks/useGetMovies";
import { useLocalSearchParams } from "expo-router";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MovieDetails = () => {
  const { id } = useLocalSearchParams();
  const { data, loading, error } = useTMDB(id, "details");

  console.log(`https://image.tmdb.org/t/p/w500${data?.poster_path}`); // ✅ Fixed template literal syntax

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#030014" }}>
      {data?.poster_path && (
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
          }}
          resizeMode="cover"
          style={{ width: "100%", height: 400 }}
        />
      )}

      <View>
        <Text
          style={{
            color: "white",
            fontSize: 20,
            fontWeight: 700,
            paddingTop: 17,
            paddingLeft: 20,
            paddingBottom: 6,
          }}
        >
          {data?.original_title}
        </Text>

        <View>
          <Text
            style={{
              color: "white",
              fontSize: 20,
              fontWeight: 700,
              paddingTop: 17,
              paddingLeft: 20,
              paddingBottom: 6,
            }}
          >
            {data?.release_date.trim().split("-")[0]}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MovieDetails;
