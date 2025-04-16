import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function RootLayout() {
  return (
    <>
      <StatusBar hidden />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="movie/[id]"
          options={{
            headerShown: false,
          }}
        />{" "}
        <Stack.Screen
          name="tv/[id]"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </>
  );
}
