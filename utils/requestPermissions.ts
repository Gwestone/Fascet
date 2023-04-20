import * as MediaLibrary from "expo-media-library";

async function requestMediaLibraryPermission(): Promise<boolean> {
  const { status } = await MediaLibrary.getPermissionsAsync();
  if (status !== "granted") {
    const { status: newStatus } = await MediaLibrary.requestPermissionsAsync();
    if (newStatus !== "granted") {
      console.log("Permission not granted for media library");
      return false;
    }
  }
  return true;
}
export { requestMediaLibraryPermission };
