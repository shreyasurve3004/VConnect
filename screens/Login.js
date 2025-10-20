// screens/Login.js
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "../firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function LoginScreen({ navigation }) {
  const [identifier, setIdentifier] = useState(""); // username
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!identifier || !password) {
      Alert.alert("Error", "Please enter your username and password");
      return;
    }

    try {
      // Query Firestore for username
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", identifier));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        Alert.alert("Login Failed", "Username not found");
        return;
      }

      const userData = querySnapshot.docs[0].data();

      // Check if verified
      if (!userData.verified) {
        Alert.alert(
          "Email not verified",
          "Please verify your email before logging in"
        );
        return;
      }

      const email = userData.email;

      // Authenticate with Firebase Auth using stored email
      await signInWithEmailAndPassword(auth, email, password);

      navigation.replace("Home", { userName: identifier });
    } catch (error) {
      Alert.alert("Login Failed", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.iconCircle}>
            <Ionicons name="wifi" size={28} color="#fff" />
          </View>
          <Text style={styles.appTitle}>V-connect</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Login</Text>

          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="eg. name.surname.rollNo"
            value={identifier}
            onChangeText={setIdentifier}
            autoCapitalize="none"
            placeholderTextColor="#9aa0a6"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#9aa0a6"
          />

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={styles.forgot}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        {/* Signup */}
        <Text style={styles.signup}>
          Don’t have an account?{" "}
          <Text
            style={styles.signupLink}
            onPress={() => navigation.navigate("SignUp")}
          >
            Sign Up
          </Text>
        </Text>

        {/* Footer */}
        <Text style={styles.footer}>© 2025 V-connect. All rights reserved.</Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F7F9FC" },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  /* Header */
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FF6B00",
    justifyContent: "center",
    alignItems: "center",
  },
  appTitle: {
    color: "#2868deff",
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 10,
  },

  /* Card */
  card: {
    width: "92%",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 22,
    paddingHorizontal: 18,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 14,
  },
  label: {
    alignSelf: "flex-start",
    marginLeft: 6,
    fontSize: 12,
    color: "#333",
    marginTop: 8,
    marginBottom: 6,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#E6E9EE",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
  },

  /* Buttons & links */
  loginButton: {
    marginTop: 14,
    width: "100%",
    backgroundColor: "#2e6bdeff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  forgot: {
    color: "#0B5FFF",
    fontSize: 13,
    marginTop: 10,
  },

  /* Signup + footer */
  signup: {
    fontSize: 13,
    color: "#444",
    marginTop: 12,
  },
  signupLink: {
    color: "#0B5FFF",
    fontWeight: "700",
  },
  footer: {
    fontSize: 11,
    color: "#9AA0A6",
    marginTop: 18,
    textAlign: "center",
  },
});
