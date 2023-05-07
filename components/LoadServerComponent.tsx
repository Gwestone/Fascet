import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import CustomButton from "./CustomButton";
import { StatusBar } from "expo-status-bar";
import ImageOptionComponent from "./ImageOptionComponent";

interface LoadServerProps {
  sessionId: number;
  onPress(base64_image: string): void;
}

export default function LoadServerComponent({
  sessionId,
  onPress,
}: LoadServerProps) {
  const [imageCount, setImageCount] = useState(0);

  useEffect(() => {
    async function fetchCount() {
      const response = await fetch("http://192.168.1.103:5000/storage/count", {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId: sessionId }),
        method: "POST",
      });

      const responseData = await response.json();
      setImageCount(responseData["count"]);
    }

    fetchCount();
  }, []);

  return (
    <View style={styles.listContainer}>
      <ScrollView style={styles.optionsList}>
        {[...Array(imageCount)].map((x, i) => (
          <ImageOptionComponent
            key={i}
            sessionId={sessionId}
            imageId={i}
            onPress={onPress}
          />
        ))}
      </ScrollView>
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
  optionsList: {
    width: "90%",
    flex: 1,
  },
  optionButton: {
    marginTop: 10,
  },
  listContainer: {
    marginTop: 50,
  },
});
