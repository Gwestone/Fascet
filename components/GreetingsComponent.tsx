import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import CustomButton from "./CustomButton";
import { StatusBar } from "expo-status-bar";

interface greetingsProps {
  onDocumentSelect(): void;
}
export default function GreetingsComponent({
  onDocumentSelect,
}: greetingsProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome.</Text>
      <Text style={styles.title}>1. Find and upload image.</Text>
      <Text style={styles.title}>2. Select alghoritm to process image</Text>
      <CustomButton message={"Open file."} onPress={onDocumentSelect} />
      <StatusBar style="auto" />
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
});
