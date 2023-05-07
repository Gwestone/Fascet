import {
  Image,
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

interface ImageOptionProps {
  sessionId: number;
  imageId: number;
  onPress(base64_image: string): void;
}

export default function ImageOptionComponent({
  sessionId,
  imageId,
  onPress,
}: ImageOptionProps) {
  const [base64Image, setBase64Image] = useState();

  useEffect(() => {
    function getImage(sessionId: number, imageId: number) {
      fetch("http://192.168.1.103:5000/storage/image", {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId: sessionId, imageId: imageId }),
        method: "POST",
      }).then((response) => {
        response.json().then((parsedResponse) => {
          setBase64Image(parsedResponse["image_base64"]);
        });
      });
    }
    getImage(sessionId, imageId);
  }, []);

  return (
    <Pressable
      onPress={() => {
        onPress(base64Image!);
      }}
    >
      {/*<Text>{base64Image}</Text>*/}
      <Image
        style={{
          width: "90%",
          aspectRatio: 1920 / 1080,
          height: 200,
          flex: 1,
          marginTop: 10,
          marginLeft: 25,
          marginRight: 25,
        }}
        source={{
          uri: `data:image/jpeg;base64,${base64Image}`,
        }}
      />
    </Pressable>
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
  },
  optionButton: {
    marginTop: 10,
  },
});
