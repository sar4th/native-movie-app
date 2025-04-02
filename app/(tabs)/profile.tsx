import LoginForm from "@/components/LoginForm";
import SignUpForm from "@/components/SignUpForm";
import UserProfile from "@/components/user-profile";
import { getCurrentUser, getUserData, isUserLoggedIn } from "@/utils/auth";
import { useState, useEffect } from "react";
import { Text, View, ActivityIndicator } from "react-native";

export default function Profile() {
  const [signUpClicked, setSignUpClicked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const [userData, setUserData] = useState();
  useEffect(() => {
    // Check if user is logged in when component mounts
    const checkLoginStatus = async () => {
      try {
        const currentUserData = await getCurrentUser();
        setIsLoggedIn(!currentUserData.expired);
        console.log(currentUserData, "sjsgjhjghs");
        setUserData(currentUserData);
      } catch (error) {
        console.error("Error checking login status:", error);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  const toggleSignUp = () => {
    setSignUpClicked(!signUpClicked);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#030014",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {loading ? (
        <ActivityIndicator size="large" color="#A076F2" />
      ) : isLoggedIn ? (
        <UserProfile userData={userData} />
      ) : signUpClicked ? (
        <>
          <SignUpForm />
          <Text
            style={{
              color: "#A076F2",
              marginTop: 15,
              textDecorationLine: "underline",
            }}
            onPress={toggleSignUp}
          >
            Already have an account? Log in instead
          </Text>
        </>
      ) : (
        <>
          <LoginForm />
          <Text
            style={{
              color: "#A076F2",
              marginTop: 15,
              textDecorationLine: "underline",
            }}
            onPress={toggleSignUp}
          >
            Don't have an account? Sign up instead
          </Text>
        </>
      )}
    </View>
  );
}
