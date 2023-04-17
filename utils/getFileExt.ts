export type File = {
  path: string;
  aspectRatio: number;
  base64: string | undefined;
};

export function getFileExt(path: string, file: File) {
  let splitArr = file!.path.split(".");
  return splitArr[splitArr.length - 1];
}
