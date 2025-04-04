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
import { useRouter } from "expo-router";
import { loginUser } from "@/utils/auth";

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
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const userSession = await loginUser(data);
      router.push("/");
    } catch (err: any) {
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
