import { Pressable, StyleSheet, Text } from "react-native";
import React from "react";

interface styledButtonProps {
  message: string;
  onPress?(): void;
}
export default function CustomButton({ message, onPress }: styledButtonProps) {
  return (
    <Pressable
      style={styles.findButton}
      onPress={() => {
        if (onPress !== undefined) {
          onPress();
        }
      }}
    >
      <Text style={styles.findTextButton}>{message}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
});
