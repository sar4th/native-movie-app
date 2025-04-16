import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { Tabs } from "expo-router";
import { Image, ImageBackground, Text, View } from "react-native";

const _Layout = () => {
  const TabIcon = ({ focused, icon, title }: any) => {
    if (focused) {
      return (
        <ImageBackground
          source={images.highlight}
          style={{
            flexDirection: "row",
            width: "100%",
            flex: 1,
            minWidth: 112,
            minHeight: 56,
            marginTop: 16,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 9999,
            overflow: "hidden",
          }}
        >
          <Image
            source={icon}
            tintColor="#151312"
            style={{ width: 20, height: 20 }}
          />
          <Text
            style={{
              color: "#000000",
              fontSize: 16,
              fontWeight: "600",
              marginLeft: 8,
            }}
          >
            {title}
          </Text>
        </ImageBackground>
      );
    }

    return (
      <View
        style={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 16,
          borderRadius: 9999,
        }}
      >
        <Image
          source={icon}
          tintColor="#A8B5DB"
          style={{ width: 20, height: 20 }}
        />
      </View>
    );
  };

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarStyle: {
          backgroundColor: "#0F0D23",
          borderRadius: 50,
          marginHorizontal: 20,
          marginBottom: 36,
          height: 52,
          position: "absolute",
          overflow: "hidden",
          borderWidth: 1,
          borderColor: "#0F0D23",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.movie} title="Home" />
          ),
        }}
      />
      <Tabs.Screen
        name="tvShows"
        options={{
          title: "TvShows",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.tvShow} title="Tv" />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.search} title="Search" />
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.save} title="Saved" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.person} title="Profile" />
          ),
        }}
      />
    </Tabs>
  );
};
export default _Layout;
