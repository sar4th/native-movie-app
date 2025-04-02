import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { Account, Client } from "react-native-appwrite";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
// If using Expo, you might prefer SecureStore for sensitive data:
// import * as SecureStore from 'expo-secure-store';

const LoginForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const client = new Client().setProject("67ebd6aa00151ab4eae3"); // Your project ID
  const account = new Account(client);

  // Save user data to storage
  const saveUserData = async (userData) => {
    try {
      // Save the entire user object as a JSON string
      await AsyncStorage.setItem("userData", JSON.stringify(userData));

      // For authentication purposes, you might want to store the session separately
      await AsyncStorage.setItem(
        "userSession",
        JSON.stringify({
          userId: userData.$id,
          email: userData.email,
          isLoggedIn: true,
          lastLogin: new Date().toISOString(),
        }),
      );

      console.log("User data saved successfully");
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  // Get current user after successful login
  const getCurrentUser = async () => {
    try {
      const userData = await account.get();
      return userData;
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      // Create session with email and password
      const session = await account.createEmailPasswordSession(
        data.email,
        data.password,
      );

      // Get current user data
      const userData = await getCurrentUser();

      if (userData) {
        // Store user data on device
        await saveUserData(userData);
        router.push("/");
      } else {
        Alert.alert("Login Error", "Failed to get user data after login");
      }
    } catch (err) {
      console.error("Login error:", err);
      Alert.alert("Login Failed", err.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login </Text>

      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#A5A5A5"
          />
        )}
        name="email"
        rules={{
          required: "You must enter your email",
          pattern: {
            value: /^\S+@\S+$/i,
            message: "Enter a valid email address",
          },
        }}
      />
      {errors.email && (
        <Text style={styles.errorText}>{errors.email.message}</Text>
      )}

      {/* Password Field */}
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            autoCapitalize="none"
            placeholderTextColor="#A5A5A5"
          />
        )}
        name="password"
        rules={{
          required: "You must enter your password",
          minLength: {
            value: 6,
            message: "Password must be at least 6 characters",
          },
        }}
      />
      {errors.password && (
        <Text style={styles.errorText}>{errors.password.message}</Text>
      )}

      {/* Submit Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit(onSubmit)}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? "Logging in..." : "Login"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0F0D23",
    width: 350,
    padding: 20,
    alignItems: "center",
    borderRadius: 10,
  },

  title: {
    color: "#A076F2",
    fontSize: 36,
    textAlign: "center",
    paddingBottom: 20,
    letterSpacing: 1,
    textTransform: "capitalize",
  },

  input: {
    height: 40,
    borderColor: "#212261",
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
    width: "100%",
    borderRadius: 5,
    backgroundColor: "transparent",
    color: "white",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    fontSize: 12,
  },
  buttonContainer: {
    width: "100%",
    marginTop: 40,
  },
  submittedContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#212261",
    borderRadius: 5,
    width: "100%",
  },
  submittedTitle: {
    color: "#A076F2",
    fontWeight: "bold",
  },
  button: {
    marginTop: 10,
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
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default LoginForm;
