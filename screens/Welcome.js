import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Welcome({ navigation }) {
  return (
    <View style={styles.container}>
      <Ionicons name="wifi" size={80} color="#FF6B00" />
      <Text style={styles.title}>Welcome to V-connect</Text>
      <Text style={styles.subtitle}>Your all-in-one academic companion</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Everything you need in one place</Text>
        <View style={styles.item}>
          <Ionicons name="book-outline" size={20} color="#1976D2" />
          <Text style={styles.itemText}>Access all your lecture notes and study materials</Text>
        </View>
        <View style={styles.item}>
          <Ionicons name="list-outline" size={20} color="#1976D2" />
          <Text style={styles.itemText}>Track assignments and submission deadlines</Text>
        </View>
        <View style={styles.item}>
          <Ionicons name="calendar-outline" size={20} color="#1976D2" />
          <Text style={styles.itemText}>Stay updated with campus events and activities</Text>
        </View>
        <View style={styles.item}>
          <Ionicons name="notifications-outline" size={20} color="#1976D2" />
          <Text style={styles.itemText}>Receive important notifications and announcements</Text>
        </View>
      </View>

      <Text style={styles.footerText}>
        Unifying all your academic and administrative tasks in one simple interface
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>

      <Text style={styles.copyright}>© 2025 VConnect. All rights reserved.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1976D2",
    marginTop: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1976D2",
    marginBottom: 12,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  itemText: {
    marginLeft: 10,
    color: "#333",
    flexShrink: 1,
  },
  footerText: {
    textAlign: "center",
    fontSize: 12,
    color: "#666",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#1976D2",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 6,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  copyright: {
    fontSize: 10,
    color: "#888",
    marginTop: 10,
  },
});