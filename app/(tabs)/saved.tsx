import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  FlatList,
  Image,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useIsFocused } from "@react-navigation/native";

import MovieCard from "@/components/MovieCard";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { getSavedMovies } from "@/utils/appwrite";
import { getCurrentUser } from "@/utils/auth";

export default function Saved() {
  const [searchQuery, setSearchQuery] = useState("");
  const isFocused = useIsFocused();
  const [userSavedMovies, setUserSavedMovies] = useState<any[]>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    async function fetchSavedMovies() {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        const saved = await getSavedMovies(currentUser.targets[0].$id);
        setUserSavedMovies(saved);
      }
    }
    fetchSavedMovies();
  }, [isFocused]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [userSavedMovies]);

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

          {userSavedMovies?.length > 0 ? (
            <FlatList
              data={userSavedMovies}
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
          ) : (
            <Animated.View
              style={{
                marginTop: 80,
                opacity: fadeAnim,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={icons.noMoviesIcon} // Add a glowing movie icon here
                style={{
                  width: 100,
                  height: 100,
                  marginBottom: 20,
                  tintColor: "#A855F7",
                }}
              />

              <Text
                style={{
                  color: "white",
                  fontSize: 18,
                  fontWeight: "600",
                  textAlign: "center",
                  opacity: 0.9,
                }}
              >
                No saved movies found 🎬
              </Text>

              <Text
                style={{
                  color: "#aaa",
                  fontSize: 14,
                  marginTop: 8,
                  textAlign: "center",
                  paddingHorizontal: 20,
                }}
              >
                Start exploring and add your favorites to save them here!
              </Text>
            </Animated.View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
