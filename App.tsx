import { StatusBar } from "expo-status-bar";
// @ts-ignore
import {
  StyleSheet,
  Text,
  View,
  ToastAndroid,
  Platform,
  Image,
  PermissionsAndroid,
  ScrollView,
} from "react-native";
import React, { useState } from "react";

import StyledButton from "./components/StyledButton";
import { File } from "./utils/getFileExt";
import { MosaicAlgorithms } from "./utils/MosaicAlgoritms";
import Spinner from "react-native-loading-spinner-overlay";
import { launchImageLibraryAsync, MediaTypeOptions } from "expo-image-picker";
import saveImage from "./utils/saveImage";
import { requestMediaLibraryPermission } from "./utils/requestPermissions";

export default function App() {
  const [loadedFile, setLoadedFile] = useState<File>();
  const [processedFile, setProcessedFile] = useState<File>();
  const [loading, setLoading] = useState<boolean>(false);

  async function onDocumentSelect() {
    setLoading(true);
    await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Images,
      selectionLimit: 1,
      base64: true,
    })
      .then((result) => {
        setLoadedFile({
          path: result.assets![0].uri!,
          aspectRatio: result.assets![0].width! / result.assets![0].height!,
          base64: result.assets?.[0].base64!,
        });
        setProcessedFile({
          path: result.assets![0].uri!,
          aspectRatio: result.assets![0].width! / result.assets![0].height!,
          base64: result.assets?.[0].base64!,
        });
      })
      .catch((error) => {
        console.log(error);
      });
    setLoading(false);
  }

  async function onSaveImage() {
    setLoading(true);
    const mediaPermission = await requestMediaLibraryPermission();
    if (mediaPermission) {
      await saveImage(processedFile?.base64!);
    }
    setLoading(false);
  }
  async function applyFilter(algorithm: MosaicAlgorithms) {
    switch (algorithm) {
      case "Initial":
        setProcessedFile({
          path: loadedFile!.path,
          aspectRatio: loadedFile!.aspectRatio,
          base64: loadedFile!.base64,
        });
        break;
      case "Voronoi":
        setLoading(true);

        const baseUrl = "http://192.168.1.103:5000";
        const response = await fetch(baseUrl + "/mosaics/voronoi", {
          body: JSON.stringify({
            base64_image: loadedFile?.base64,
          }),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        });

        const data = await response.text();
        setProcessedFile({
          path: "",
          aspectRatio: 1920 / 1080,
          base64: data,
        });

        setLoading(false);
        break;
    }
  }

  return (
    <View style={styles.fluid}>
      <Spinner
        //visibility of Overlay Loading Spinner
        visible={loading}
        //Text with the Spinner
        textContent={"Loading..."}
        //Text style of the Spinner Text
        textStyle={styles.spinnerTextStyle}
      />
      {/*first screen start*/}
      {loadedFile === undefined ? (
        <View style={styles.container}>
          <Text style={styles.title}>Welcome.</Text>
          <Text style={styles.title}>
            Find and select file from directory to start working with app!
          </Text>
          <StyledButton message={"Open file."} onPress={onDocumentSelect} />
          <StatusBar style="auto" />
        </View>
      ) : (
        <View style={styles.pass} />
      )}
      {/*first screen end*/}
      {/*second screen start*/}
      {loadedFile !== undefined ? (
        <View style={styles.container}>
          <Image
            style={{
              width: "90%",
              aspectRatio: processedFile?.aspectRatio,
            }}
            source={{
              uri: `data:image/jpeg;base64,${processedFile?.base64}`,
            }}
          />
          <View style={styles.inlineButton}>
            <StyledButton message={"Load new"} onPress={onDocumentSelect} />
            <StyledButton message={"Save Image"} onPress={onSaveImage} />
          </View>
          <ScrollView style={styles.optionsList}>
            <View style={styles.optionButton}>
              <StyledButton
                message={"Initial"}
                onPress={() => applyFilter("Initial")}
              />
            </View>
            <View style={styles.optionButton}>
              <StyledButton
                message={"Voronoi"}
                onPress={() => applyFilter("Voronoi")}
              />
            </View>
            <View style={styles.optionButton}>
              <StyledButton message={"Placeholder"} />
            </View>
            <View style={styles.optionButton}>
              <StyledButton message={"Placeholder"} />
            </View>
            <View style={styles.optionButton}>
              <StyledButton message={"Placeholder"} />
            </View>
          </ScrollView>
        </View>
      ) : (
        <View style={styles.pass} />
      )}
      {/*second screen end*/}
    </View>
  );
}

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: "#002366",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
  },
  fluid: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 25,
    textAlign: "center",
    paddingLeft: 10,
    paddingRight: 10,
    fontFamily: "Roboto",
  },
  findTextButton: {
    fontSize: 20,
    fontFamily: "Roboto",
    color: "#fff",
  },
  findButton: {
    borderRadius: 9999,
    backgroundColor: "#037ffc",
    padding: 20,
    paddingVertical: 10,
  },
  notDisplay: {
    display: "none",
  },
  optionsList: {
    width: "90%",
    maxHeight: "25%",
  },
  optionButton: {
    marginTop: 10,
  },
  inlineButton: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  pass: {},
});
