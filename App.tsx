import { StatusBar } from 'expo-status-bar';
// @ts-ignore
import {
    StyleSheet,
    Text,
    View,
    ToastAndroid,
    Platform,
    AlertIOS,
    Image,
    PermissionsAndroid,
    ScrollView
} from 'react-native';
import React, {useState} from "react";
import RNFetchBlob from 'rn-fetch-blob';

import StyledButton from "./Components/StyledButton";
import {launchImageLibrary} from "react-native-image-picker"
import RNFS from "react-native-fs"

export default function App() {

    const [, updateState] = React.useState<{}>();
    const forceUpdate = React.useCallback(() => updateState({}), []);
    type File = {path: string, aspectRatio: number}
    const [file, setFile] = useState<File | undefined>(undefined);

    function showMessage(message: string){
        if (Platform.OS === "android"){
            ToastAndroid.show(
                message, 2000)
        }else{
            AlertIOS.alert(message);
        }
    }

    async function onDocumentSelect(){
        const result = await launchImageLibrary({
            mediaType: "photo",
            selectionLimit: 1,
            includeBase64: true
        });
        if (!result.didCancel && result.errorCode === undefined && result.errorMessage === undefined){
            console.log(result)
            setFile({
                    path: result.assets![0].uri!,
                    aspectRatio: result.assets![0].width! / result.assets![0].height!
                }
            )
        }else if (result.errorMessage !== undefined){
            showMessage(`Error: ${result.errorMessage}`)
        }
    }

    function onSwitchOrientation(){
        let fileClone = file;
        fileClone!.aspectRatio = 1 / fileClone!.aspectRatio;
        setFile(fileClone)
        forceUpdate()
    }

    function getFileExt(path: string){
        let splitArr = file!.path.split(".");
        return  splitArr[splitArr.length - 1];
    }

    type MosaicAlgorithms = "Initial" | "SimulatedDecorativeMosaic" | "Jigsaw" | "Voronoi";
    async function applyFilter(algorithm: MosaicAlgorithms){

        let baseString = await RNFS.readFileAssets(file!.path, "base64")
        console.log(baseString)
        console.log(getFileExt(file!.path))

        switch (algorithm){
            case "Initial":
                console.log("initial")
                break
            case "SimulatedDecorativeMosaic":
                console.log("Decorative")
                break
            case "Jigsaw":
                console.log("Jigsaw")
                break
            case "Voronoi":
                console.log("Voronoi")
                break
        }
    }

    function pass(){}

  return (
      <View style={styles.fluid}>
          {/*first screen start*/}
          {
              file === undefined ?
                  <View style={styles.container}>
                      <Text style={styles.title}>Welcome.</Text>
                      <Text style={styles.title}>Find and select file from directory to start working with app!</Text>
                      <StyledButton message={"Open file."} onPress={onDocumentSelect} />
                      <StatusBar style="auto" />
                  </View>
                  : <View style={styles.pass} />
          }
          {/*first screen end*/}
          {/*second screen start*/}
          {
              file !== undefined ?
                  <View style={styles.container}>
                      <Image
                          style={{
                              width: '90%',
                              aspectRatio: file.aspectRatio
                          }}
                          source={{
                              uri: file.path
                          }}
                      />
                      <View style={styles.inlineButton}>
                        <StyledButton message={"Load new"} onPress={onDocumentSelect} />
                          <StyledButton message={"Save Image"} onPress={pass} />
                      </View>
                      <ScrollView style={styles.optionsList}>
                          <View style={styles.optionButton}>
                            <StyledButton message={"Initial"} onPress={()=>applyFilter("Initial")} />
                          </View>
                          <View style={styles.optionButton}>
                            <StyledButton message={"Simulated decorative mosaic"} onPress={()=>applyFilter("SimulatedDecorativeMosaic")} />
                          </View>
                          <View style={styles.optionButton}>
                            <StyledButton message={"JigSaw algorithm"} onPress={()=>applyFilter("Jigsaw")} />
                          </View>
                          <View style={styles.optionButton}>
                              <StyledButton message={"Voronoi algorithm"} onPress={()=>applyFilter("Voronoi")} />
                          </View>
                          <View style={styles.optionButton}>
                              <StyledButton message={"Photo"} onPress={pass} />
                          </View>
                          <View style={styles.optionButton}>
                              <StyledButton message={"Photo"} onPress={pass} />
                          </View>
                          <View style={styles.optionButton}>
                              <StyledButton message={"Photo"} onPress={pass} />
                          </View>
                      </ScrollView>
                  </View>
                  : <View style={styles.pass} />
          }
          {/*second screen end*/}
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
      gap: 15
  },
    fluid: {
      width: '100%',
        height: '100%'
    },
    title: {
      fontSize: 25,
        textAlign: "center",
        paddingLeft: 10,
        paddingRight: 10,
        fontFamily: "Roboto"
    },
    findTextButton: {
        fontSize: 20,
        fontFamily: "Roboto",
        color: "#fff"
    },
    findButton: {
      borderRadius: 9999,
        backgroundColor: '#037ffc',
        padding: 20,
        paddingVertical: 10
    },
    notDisplay: {
      display: "none"
    },
    optionsList: {
      width: "90%",
        maxHeight: "25%"
    },
    optionButton: {
      marginTop: 10
    },
    inlineButton: {
        flexDirection:'row',
        flexWrap:'wrap',
        gap: 10
    },
    pass: {}
});
