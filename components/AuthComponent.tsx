import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import CustomButton from "./CustomButton";
import { StatusBar } from "expo-status-bar";

interface authProps {
  setLoading(loading: boolean): void;
  setSessionId(id: number): void;
  setUsername(username: string): void;
}

export default function AuthComponent({
  setLoading,
  setSessionId,
  setUsername: propSetUsername,
}: authProps) {
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();

  const [loggedIn, setLoggedIn] = useState();
  const [nowLogin, setNowLogin] = useState(true);

  async function submitLogin() {
    setLoading(true);

    let formData = new FormData();
    formData.append("username", username!);
    formData.append("password", password!);

    const response = await fetch(
      "http://192.168.1.103:5000/auth/" + (nowLogin ? "login" : "register"),
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
        method: "POST",
      }
    );

    const responseData = await response.text();
    if (
      response.status === 200 &&
      responseData !== "ok" &&
      responseData !== "err"
    ) {
      setSessionId(Number(responseData));
      propSetUsername(username!);
    }

    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Now {nowLogin ? "Logging" : "Registering"}
      </Text>
      <CustomButton
        message={"witch to " + (nowLogin ? "register" : "login")}
        onPress={() => {
          setNowLogin(!nowLogin);
        }}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        onChangeText={(e) => {
          setUsername(e);
        }}
        value={username}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={(e) => {
          setPassword(e);
        }}
        value={password}
      />
      <CustomButton
        message={nowLogin ? "Log in" : "Register"}
        onPress={submitLogin}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
    paddingTop: 20,
  },
  title: {
    fontSize: 25,
    textAlign: "center",
    paddingLeft: 10,
    paddingRight: 10,
    fontFamily: "Roboto",
  },
  input: {
    height: 40,
    width: "80%",
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 20,
    paddingLeft: 10,
  },
});
