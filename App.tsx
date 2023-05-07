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
  SafeAreaView,
  Button,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";

import CustomButton from "./components/CustomButton";
import { File } from "./utils/getFileExt";
import { MosaicAlgorithms } from "./utils/MosaicAlgoritms";
import Spinner from "react-native-loading-spinner-overlay";
import { launchImageLibraryAsync, MediaTypeOptions } from "expo-image-picker";
import saveImage from "./utils/saveImage";
import { requestMediaLibraryPermission } from "./utils/requestPermissions";
import useFetch from "./hooks/useFetch";
import GreetingsComponent from "./components/GreetingsComponent";
import AuthComponent from "./components/AuthComponent";
import LoadServerComponent from "./components/LoadServerComponent";

let imagesStorage: string[] = [];

export default function App() {
  const [loadedFile, setLoadedFile] = useState<File>();
  const [processedFile, setProcessedFile] = useState<File>();
  const [loading, setLoading] = useState<boolean>(false);
  const { responseData, isLoading, updateInputData } = useFetch(
    loadedFile?.base64!,
    "Initial"
  );
  const [loggingIn, setLoggingIn] = useState(false);
  const [loadingImages, setLoadingImages] = useState(false);
  const [sessionId, setSessionId] = useState<number>(0);
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  useEffect(() => {
    if (sessionId !== 0) setLoggingIn(false);
  }, [sessionId]);

  useEffect(() => {
    setProcessedFile({
      path: "",
      aspectRatio: 1920 / 1080,
      base64: responseData,
    });
  }, [responseData]);

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
    updateInputData(algorithm, loadedFile?.base64!);
  }

  async function uploadImageToServer() {
    if (sessionId !== 0) {
      setLoading(true);

      const response = await fetch("http://192.168.1.103:5000/storage/save", {
        body: JSON.stringify({
          base64_image: processedFile?.base64,
          sessionId: sessionId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const responseData = await response.text();
      console.log(responseData);

      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.fluid}>
      <Spinner
        //visibility of Overlay Loading Spinner
        visible={loading}
        //Text with the Spinner
        textContent={"Loading..."}
        //Text style of the Spinner Text
        textStyle={styles.spinnerTextStyle}
      />

      {/*start rendering status bar*/}
      <View style={styles.topBar}>
        {loggingIn ? (
          <CustomButton message={"←"} onPress={() => setLoggingIn(false)} />
        ) : (
          <View style={styles.pass} />
        )}

        {loadingImages ? (
          <CustomButton message={"←"} onPress={() => setLoadingImages(false)} />
        ) : (
          <View style={styles.pass} />
        )}

        {!sessionId ? (
          <CustomButton
            message={"login/register"}
            onPress={() => setLoggingIn(!loggingIn)}
          />
        ) : loadedFile ? (
          <CustomButton message={username} />
        ) : (
          <View style={styles.pass} />
        )}
      </View>
      {/*end rendering status bar*/}

      {/*start rendering auth*/}
      {loggingIn ? (
        <AuthComponent
          setLoading={setLoading}
          setSessionId={setSessionId}
          setUsername={setUsername}
        />
      ) : (
        <View style={styles.pass} />
      )}
      {/*end rendering auth*/}

      {/*first screen start*/}
      {!loadedFile && !loggingIn ? (
        <GreetingsComponent onDocumentSelect={onDocumentSelect} />
      ) : (
        <View style={styles.pass} />
      )}
      {/*first screen end*/}

      {/*second screen start*/}
      {loadedFile && !loggingIn && !loadingImages ? (
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
            <CustomButton message={"Load new"} onPress={onDocumentSelect} />
            <CustomButton message={"Save Image"} onPress={onSaveImage} />
            <CustomButton
              message={"Load from server"}
              onPress={() => setLoadingImages(true)}
            />
            <CustomButton
              message={"Save on server"}
              onPress={uploadImageToServer}
            />
          </View>
          <ScrollView style={styles.optionsList}>
            <View style={styles.optionButton}>
              <CustomButton
                message={"Initial"}
                onPress={() => applyFilter("Initial")}
              />
            </View>
            <View style={styles.optionButton}>
              <CustomButton
                message={"Voronoi"}
                onPress={() => applyFilter("Voronoi")}
              />
            </View>
            <View style={styles.optionButton}>
              <CustomButton
                message={"Puzzle"}
                onPress={() => applyFilter("Puzzle")}
              />
            </View>
          </ScrollView>
        </View>
      ) : (
        <View style={styles.pass} />
      )}
      {/*second screen end*/}
      {loadingImages ? (
        <Text>
          <LoadServerComponent
            sessionId={sessionId}
            onPress={(base64_image: string) => {
              setProcessedFile({
                path: "",
                aspectRatio: 1920 / 1080,
                base64: base64_image,
              });
            }}
          />
        </Text>
      ) : (
        <View style={styles.pass} />
      )}
    </SafeAreaView>
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
    paddingTop: 20,
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
  },
  optionButton: {
    marginTop: 10,
  },
  inlineButton: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
  },
  topBar: {
    height: 90,
    width: "100%",
    backgroundColor: "#037ffc",
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingTop: "5%",
  },
  topElement: {
    height: "100%",
    backgroundColor: "yellow",
    margin: 20,
  },
  pass: {
    display: "none",
  },
});
