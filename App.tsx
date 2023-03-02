import { StatusBar } from 'expo-status-bar';
// @ts-ignore
import {StyleSheet, Text, View, ToastAndroid, Platform, AlertIOS, Image, PermissionsAndroid} from 'react-native';
import React, {useState} from "react";

import StyledButton from "./Components/StyledButton";
import {launchCamera, launchImageLibrary} from "react-native-image-picker"

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
            selectionLimit: 1
        });
        if (!result.didCancel && result.errorCode === undefined && result.errorMessage === undefined){
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
                      {/*<StyledButton message={"Switch orientation"} onPress={onSwitchOrientation} />*/}
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
    pass: {}
});
