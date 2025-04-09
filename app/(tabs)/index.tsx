import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import MovieCard from "@/components/MovieCard";
import { SearchBar } from "@/components/search-bar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { useTMDB } from "@/hooks/useGetMovies";

const TABS = ["Popular", "Top Rated", "Upcoming"];

export default function Index() {
  const { data, loading, error } = useTMDB(undefined, "dashboard-movies");
  const [activeTab, setActiveTab] = useState("Popular");

  const getMovies = () => {
    switch (activeTab) {
      case "Popular":
        return data?.popularMovies || [];
      case "Top Rated":
        return data?.topRatedMovies || [];
      case "Upcoming":
        return data?.upcomingMovies || [];
      default:
        return [];
    }
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
                onPress={() => router.push("/search")}
                placeholder="Search for a movie"
              />

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  marginTop: 40,
                  marginBottom: 20,
                }}
              >
                {TABS.map((tab) => (
                  <Pressable
                    key={tab}
                    onPress={() => setActiveTab(tab)}
                    style={{
                      paddingVertical: 8,
                      paddingHorizontal: 16,
                      borderRadius: 20,
                      backgroundColor:
                        activeTab === tab ? "white" : "#1a1a2e",
                    }}
                  >
                    <Text
                      style={{
                        color: activeTab === tab ? "#000" : "#fff",
                        fontWeight: "bold",
                      }}
                    >
                      {tab}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <FlatList
                data={getMovies()}
                renderItem={({ item }) =>
                  item.empty ? <View style={{ flex: 1 }} /> : <MovieCard {...item} />
                }
                keyExtractor={(item) => item.id.toString()}
                numColumns={3}
                scrollEnabled={false}
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
