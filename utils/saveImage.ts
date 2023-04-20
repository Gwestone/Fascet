import * as MediaLibrary from "expo-media-library";
import generateName from "./generateName";
import * as FileSystem from "expo-file-system";

const saveImage = async (base64Code: string) => {
  try {
    const filename = FileSystem.documentDirectory + generateName(10);
    await FileSystem.writeAsStringAsync(filename, base64Code, {
      encoding: FileSystem.EncodingType.Base64,
    });

    await MediaLibrary.saveToLibraryAsync(filename).catch((error) => {
      console.log(error);
    });
  } catch (error) {
    console.log(error);
  }
};

export default saveImage;
