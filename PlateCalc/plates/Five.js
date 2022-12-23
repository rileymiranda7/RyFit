import { View, Text, StyleSheet } from "react-native";
import React from "react";

export default function Five() {
  return (
    <View style={styles.container}>
      <View style={styles.plate}></View>
      <Text style={{ color: "white" }}>5</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  plate: {
    backgroundColor: "orange",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "black",
    minHeight: 80,
    minWidth: 30,
  },
  container: {
    flex: 1,
    maxWidth: 30,
    alignItems: "center",
  },
});
