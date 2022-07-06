import { View, Text, StyleSheet } from "react-native";
import React from "react";

export default function TableRow() {
  return (
    <View style={styles.container}>
      <Text>Col1</Text>
      <Text>Col2</Text>
      <Text>Col3</Text>
      <Text>Col4</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "blue",
  },
});
