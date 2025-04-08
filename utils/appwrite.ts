import { Databases, ID, Query } from "react-native-appwrite";
import { client } from "./auth";

const databases = new Databases(client);
export const getSavedMovies = async (userId: string) => {
  try {
    const response = await databases.listDocuments(
      "67ebd7370036585dd74f",
      "67ee79d700015acbe1b1",
      [Query.equal("userid", userId)],
    );
    return response.documents;
  } catch (error) {
    console.error("Error fetching saved movies:", error);
    return null;
  }
};

export const addMovieToFav = async (payload: any): Promise<void> => {
  try {
    const response = await databases.createDocument(
      "67ebd7370036585dd74f",
      "67ee79d700015acbe1b1",
      ID.unique(),
      payload,
    );
    return response
  } catch (error) {
    console.error("Error adding movie to favorites:", error);
  }
};

export const deleteMovie = async (documentId: string): Promise<void> => {
  try {
    const result = await databases.deleteDocument(
      "67ebd7370036585dd74f",
      "67ee79d700015acbe1b1",

      documentId
    );
    return result
  } catch (error) {
    console.error("Error removing movie from favorites:", error);
  }
};
