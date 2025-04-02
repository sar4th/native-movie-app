import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { Account, Client, ID } from "react-native-appwrite";
import { useRouter } from "expo-router";

const SignUpForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const router = useRouter();
  const [submittedData, setSubmittedData] = useState(null);

  const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1") // Add your Appwrite endpoint
    .setProject("67ebd6aa00151ab4eae3"); // Your project ID

  const account = new Account(client);

  const onSubmit = async (data) => {
    console.log("Form Data:", data);

    try {
      const response = await account.create(
        ID.unique(), // Generates a unique user ID
        data.email,
        data.password,
        data.name,
      );

      console.log("Account Created:", response);
      router.push("/");
    } catch (error) {
      console.log("Signup Error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      {/* Name Field */}
      <Controller
        control={control}
        name="name"
        rules={{ required: "Name is required" }}
        render={({ field }) => (
          <TextInput
            style={styles.input}
            placeholder="Your Name"
            placeholderTextColor="#A5A5A5"
            autoCapitalize="words"
            onChangeText={field.onChange}
            value={field.value}
          />
        )}
      />
      {errors.name && (
        <Text style={styles.errorText}>{errors.name.message}</Text>
      )}

      {/* Email Field */}
      <Controller
        control={control}
        name="email"
        rules={{
          required: "Email is required",
          pattern: { value: /^\S+@\S+$/i, message: "Enter a valid email" },
        }}
        render={({ field }) => (
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#A5A5A5"
            onChangeText={field.onChange}
            value={field.value}
          />
        )}
      />
      {errors.email && (
        <Text style={styles.errorText}>{errors.email.message}</Text>
      )}

      {/* Password Field */}
      <Controller
        control={control}
        name="password"
        rules={{
          required: "Password is required",
          minLength: {
            value: 6,
            message: "Password must be at least 6 characters",
          },
        }}
        render={({ field }) => (
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            autoCapitalize="none"
            placeholderTextColor="#A5A5A5"
            onChangeText={field.onChange}
            value={field.value}
          />
        )}
      />
      {errors.password && (
        <Text style={styles.errorText}>{errors.password.message}</Text>
      )}

      {/* Submit Button */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.buttonText}>Submit</Text>
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

export default SignUpForm;
