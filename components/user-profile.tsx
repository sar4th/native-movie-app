import { icons } from "@/constants/icons";
import { logOutUser } from "@/utils/auth";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, View, StyleSheet, Text, TouchableOpacity } from "react-native";

const UserProfile = ({ userData }: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={icons.person}
          style={styles.profileImage}
          resizeMode="cover"
        />
      </View>
      <Text style={{ color: "white", fontSize: 30 }}>{userData?.name}</Text>

      <Text style={{ color: "white", fontSize: 16 }}>{userData?.email}</Text>
      <View style={{ marginTop: 30, width: "100%", display: "flex", gap: 10 }}>
        <View>
          <View style={styles.optionsContainer}>
            <Text style={{ color: "white", fontSize: 24 }}>Account</Text>
            <Image source={icons.whiteArrow} style={styles.ArrowIcon} />
          </View>
        </View>
        <View style={styles.optionsContainer}>
          <Text style={{ color: "white", fontSize: 24 }}>Notifications</Text>

          <Image source={icons.whiteArrow} style={styles.ArrowIcon} />
        </View>

        <View style={styles.optionsContainer}>
          <Text style={{ color: "white", fontSize: 24 }}>Settings</Text>

          <Image source={icons.whiteArrow} style={styles.ArrowIcon} />
        </View>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setIsLoading(true);
          logOutUser()
            .then(() => {
              setIsLoading(false);

              router.push("/");
            })
            .catch((err) => {
              setIsLoading(false);
              console.log(err);
            });
        }}
      >
        <Text style={{ color: "white", fontSize: 24 }}>
          {isLoading ? "SigningOut..." : "SignOut"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
    width: "100%",
  },
  button: {
    marginTop: 60,
    width: "100%",
    height: 45,
    backgroundColor: "#A076F2",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    color: "white",
  },
  optionsContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ArrowIcon: {
    width: 20,
    height: 20,
  },
  imageContainer: {
    borderRadius: 35, // Half of the width/height to make it circular
    overflow: "hidden", // Ensures the image doesn't overflow the rounded corners
  },
  profileImage: {
    width: 70,
    height: 70,
  },
});

export default UserProfile;
