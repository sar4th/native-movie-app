import MovieCard from "@/components/MovieCard";
import { SearchBar } from "@/components/search-bar";
import { useDebounce } from "@/components/useDebounce";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { useTMDB } from "@/hooks/useGetMovies";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const debounceValue = useDebounce(searchQuery, 500);
  const { data, loading, error } = useTMDB(debounceValue);

  const handleMovieSearch = (query) => {
    setSearchQuery(query); // Update the state
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#030014" }}>
      <Image
        source={images.bg}
        style={{
          width: "100%",
          position: "absolute",
          zIndex: 0,
          resizeMode: "cover",
        }}
      />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 10 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingHorizontal: 20 }}>
          <Image
            source={icons.logo}
            style={{
              width: 48,
              height: 40,
              marginTop: 20,
              marginBottom: 20,
              alignSelf: "center",
            }}
          />

          {loading ? (
            <ActivityIndicator
              size="large"
              color="#0000ff"
              style={{ marginTop: 40, alignSelf: "center" }}
            />
          ) : error ? (
            <Text style={{ color: "white" }}>Error: {error.message}</Text>
          ) : (
            <>
              <SearchBar
                handleSearch={handleMovieSearch}
                placeholder="Search for a movie"
              />
              <FlatList
                data={data}
                renderItem={({ item }) => <MovieCard {...item} />}
                keyExtractor={(item) => item.id.toString()}
                numColumns={3}
                scrollEnabled={false}
                style={{ marginTop: 40 }}
                columnWrapperStyle={{
                  justifyContent: "space-between",
                  gap: 20,
                  paddingRight: 5,
                  marginBottom: 10,
                }}
              />
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
