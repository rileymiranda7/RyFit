import { View, Text, StyleSheet } from "react-native";
import React from "react";

import TableRow from "../components/UI/TableRow";

export default function PastWorkoutsScreen() {
  return (
    <View style={styles.container}>
      <Text>PastWorkoutsScreen</Text>
      <TableRow />
      <TableRow />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: "100%",
  },
});
