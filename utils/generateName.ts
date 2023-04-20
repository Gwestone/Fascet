const generateName = (fileNameLength: number) => {
  const possibleChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let randomName = "";

  for (let i = 0; i < fileNameLength; i++) {
    const randomIndex = Math.floor(Math.random() * possibleChars.length);
    randomName += possibleChars.charAt(randomIndex);
  }

  return randomName + ".png";
};

export default generateName;
