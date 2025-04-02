import AsyncStorage from "@react-native-async-storage/async-storage";
import { Account, Client } from "react-native-appwrite";

export const getUserData = async () => {
  try {
    const userData = await AsyncStorage.getItem("userData");
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error retrieving user data:", error);
    return null;
  }
};

export const isUserLoggedIn = async () => {
  try {
    const session = await AsyncStorage.getItem("userSession");
    return session ? JSON.parse(session).isLoggedIn : false;
  } catch (error) {
    console.error("Error checking login status:", error);
    return false;
  }
};
export const deleteSession = async () => {
  try {
    const client = new Client()
      .setEndpoint("https://cloud.appwrite.io/v1") // Your API Endpoint
      .setProject("67ebd6aa00151ab4eae3"); // Your project ID

    const account = new Account(client);

    const result = await account.deleteSessions();
    return result;
  } catch (error) {
    console.error("Error checking login status:", error);
    return false;
  }
};
export const getCurrentUser = async () => {
  try {
    const client = new Client()
      .setEndpoint("https://cloud.appwrite.io/v1") // Your API Endpoint
      .setProject("67ebd6aa00151ab4eae3"); // Your project ID

    const account = new Account(client);

    const result = await account.get();
    console.log(result, "resullttt");
    return result;
  } catch (error) {
    console.error("Error checking login status:", error);
    return false;
  }
};

export const logoutUser = async () => {
  try {
    await AsyncStorage.removeItem("userData");
    await AsyncStorage.removeItem("userSession");
    return true;
  } catch (error) {
    console.error("Error logging out:", error);
    return false;
  }
};
