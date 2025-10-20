// screens/SignUp.js
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Platform,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "../firebase/firebase";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth"; // <-- added sendEmailVerification
import { doc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { Picker } from "@react-native-picker/picker";

// Web Select for Expo web
const WebSelect = ({ value, onChange, options }) => {
  return (
    <select
      style={{
        width: "100%",
        height: 50,
        borderRadius: 12,
        border: "1px solid #ddd",
        paddingLeft: 12,
        marginBottom: 12,
        backgroundColor: "#fff",
        fontSize: 14,
      }}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((opt) => (
        <option key={opt.value || opt} value={opt.value || opt}>
          {opt.label || opt}
        </option>
      ))}
    </select>
  );
};

export default function SignUpScreen({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [securityQ, setSecurityQ] = useState("");
  const [securityA, setSecurityA] = useState("");

  const [yearValue, setYearValue] = useState("2022");
  const [branchValue, setBranchValue] = useState("IT");
  const [yearStudyValue, setYearStudyValue] = useState("First Year");
  const [batchValue, setBatchValue] = useState("1");

  const [focusField, setFocusField] = useState(null);
  const [buttonScale] = useState(new Animated.Value(1));

  const yearItems = ["2022", "2023", "2024", "2025"];
  const branchItems = [
    { label: "Information Technology", value: "IT" },
    { label: "Computer Engineering", value: "CE" },
    { label: "Electronics and Telecommunication", value: "EXTC" },
    { label: "Electronics and Computer Science", value: "EXCS" },
    { label: "Biomedical Engineering", value: "BIOMED" },
  ];
  const yearStudyItems = ["First Year", "Second Year", "Third Year", "Final Year"];
  const batchItems = ["1", "2", "3"];

  const handleSignUp = async () => {
    const fullNameRegex = /^[A-Z][a-z]+ [A-Z][a-z]+( [A-Z][a-z]+)?$/;
    if (!fullNameRegex.test(fullName)) {
      Alert.alert(
        "Invalid Full Name",
        "Full Name must be like 'FirstName MiddleName LastName' with proper capitalization"
      );
      return;
    }
    if (!username || !password || !email) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", username));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        Alert.alert("Username Taken", "Please choose another username");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        fullName,
        rollNo,
        email,
        yearOfAdmission: yearValue,
        branch: branchValue,
        year: yearStudyValue,
        batch: batchValue,
        username,
        password,
        securityQ,
        securityA,
        verified: false,
      });

      // SEND EMAIL VERIFICATION
      await sendEmailVerification(user, {
        url: "https://yourusername.github.io/vconnect-verify/", // <-- URL of hosted verification page
      });

      Alert.alert(
        "Success",
        "Account created! A verification email has been sent to your VIT email. Please verify to continue."
      );
      navigation.replace("Login");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const isWeb = Platform.OS === "web";

  const PickerComponent = ({ value, onChange, options }) => {
    return isWeb ? (
      <WebSelect value={value} onChange={onChange} options={options} />
    ) : (
      <Picker selectedValue={value} onValueChange={onChange} style={styles.picker}>
        {options.map((opt) => (
          <Picker.Item key={opt.value || opt} label={opt.label || opt} value={opt.value || opt} />
        ))}
      </Picker>
    );
  };

  const onButtonPressIn = () => {
    Animated.spring(buttonScale, { toValue: 0.95, useNativeDriver: true }).start();
  };
  const onButtonPressOut = () => {
    Animated.spring(buttonScale, { toValue: 1, friction: 3, tension: 40, useNativeDriver: true }).start();
  };

  return (
    <SafeAreaView style={styles.safe}>
      {isWeb ? (
        <div style={{ maxHeight: "100vh", overflow: "auto", padding: 20, backgroundColor: "#F7F9FC" }}>
          <View style={styles.card}>
            <Header />
            <Form />
          </View>
        </div>
      ) : (
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator>
          <View style={styles.card}>
            <Header />
            <Form />
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );

  function Header() {
    return (
      <View style={styles.headerRow}>
        <View style={styles.iconCircle}>
          <Ionicons name="wifi" size={28} color="#fff" />
        </View>
        <Text style={styles.appTitle}>V-connect</Text>
      </View>
    );
  }

  function Form() {
    const renderInput = (label, value, setter, placeholder, secure = false, name) => (
      <View>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          style={[
            styles.input,
            focusField === name && { borderColor: "#0B5FFF", shadowColor: "#0B5FFF", shadowOpacity: 0.3, shadowRadius: 6 },
          ]}
          placeholder={placeholder}
          value={value}
          onChangeText={setter}
          placeholderTextColor="#9aa0a6"
          secureTextEntry={secure}
          onFocus={() => setFocusField(name)}
          onBlur={() => setFocusField(null)}
        />
      </View>
    );

    return (
      <View>
        <Text style={styles.signupTitle}>Create Account</Text>

        {renderInput("Full Name", fullName, setFullName, "FirstName MiddleName LastName", false, "fullName")}
        {renderInput("Roll No.", rollNo, setRollNo, "eg. 23101A0001", false, "rollNo")}
        {renderInput("Email", email, setEmail, "name.surname@vit.edu.in", false, "email")}

        <Text style={styles.label}>Year of Admission</Text>
        <PickerComponent value={yearValue} onChange={setYearValue} options={yearItems} />

        <Text style={styles.label}>Branch</Text>
        <PickerComponent value={branchValue} onChange={setBranchValue} options={branchItems} />

        <Text style={styles.label}>Year</Text>
        <PickerComponent value={yearStudyValue} onChange={setYearStudyValue} options={yearStudyItems} />

        <Text style={styles.label}>Batch</Text>
        <PickerComponent value={batchValue} onChange={setBatchValue} options={batchItems.map(b => ({label: `Batch ${b}`, value: b}))} />

        {renderInput("Username", username, setUsername, "name.surname.rollNo", false, "username")}
        {renderInput("Password", password, setPassword, "Password", true, "password")}
        {renderInput("Security Question", securityQ, setSecurityQ, "eg. Your pet's name?", false, "securityQ")}
        {renderInput("Answer", securityA, setSecurityA, "eg. Fluffy", false, "securityA")}

        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity
            style={styles.signupButton}
            onPressIn={onButtonPressIn}
            onPressOut={onButtonPressOut}
            onPress={handleSignUp}
          >
            <Text style={styles.signupButtonText}>Sign Up</Text>
          </TouchableOpacity>
        </Animated.View>

        <Text style={styles.loginText}>
          Already have an account? <Text style={styles.loginLink} onPress={() => navigation.navigate("Login")}>Login</Text>
        </Text>

        <Text style={styles.footer}>© 2025 V-connect. All rights reserved.</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingBottom: 30, backgroundColor: "#F7F9FC" },
  card: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 30,
  },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 18 },
  iconCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: "#FF6B00", justifyContent: "center", alignItems: "center" },
  appTitle: { color: "#306bdaff", fontSize: 22, fontWeight: "700", marginLeft: 12 },
  signupTitle: { fontSize: 22, fontWeight: "700", marginBottom: 20, alignSelf: "center" },
  label: { fontSize: 13, color: "#555", marginTop: 12, marginBottom: 6 },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#fdfdfd",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  picker: { width: "100%", height: 50, borderWidth: 1, borderColor: "#ddd", borderRadius: 12, backgroundColor: "#fdfdfd", marginBottom: 12, paddingHorizontal: 12 },
  signupButton: { marginTop: 18, width: "100%", backgroundColor: "#215ac4ff", paddingVertical: 14, borderRadius: 12, alignItems: "center", marginBottom: 12 },
  signupButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  loginText: { fontSize: 14, color: "#444", marginBottom: 12, marginTop: 8, textAlign: "center" },
  loginLink: { color: "#2163ddff", fontWeight: "700" },
  footer: { fontSize: 12, color: "#aaa", marginTop: 10, textAlign: "center" },
});
