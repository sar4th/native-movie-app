import { Account, Client } from "react-native-appwrite";

export const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("67ebd6aa00151ab4eae3");

export const account = new Account(client);

export const logOutUser = async () => {
  try {
    const result = await account.deleteSessions();
    return result;
  } catch (error) {
    console.error("Error checking login status:", error);
    return false;
  }
};
export const getCurrentUser = async () => {
  try {
    const result = await account.get();
    return result;
  } catch (error) {
    console.error("Error checking login status:", error);
    return false;
  }
};
export const loginUser = async (data) => {
  const session = await account.createEmailPasswordSession(
    data.email,
    data.password,
  );
  return session;
};
