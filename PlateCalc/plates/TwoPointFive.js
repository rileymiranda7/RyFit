import { View, Text, StyleSheet } from "react-native";
import React from "react";

export default function TwoPointFive() {
  return (
    <View style={styles.container}>
      <View style={styles.plate}></View>
      <Text style={{ color: "white" }}>2.5</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  plate: {
    backgroundColor: "purple",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "black",
    minHeight: 50,
    minWidth: 30,
  },
  container: {
    flex: 1,
    maxWidth: 30,
    alignItems: "center",
  },
});
