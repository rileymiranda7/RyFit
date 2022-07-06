import { View, Text, StyleSheet } from "react-native";
import React from "react";

import TableRow from "../components/UI/table/TableHeaderRow";
import IncompleteSetNumber from "../components/UI/table/row/IncompleteSetNumber";
import IncompleteRow from "../components/UI/table/IncompleteRow";

export default function PastWorkoutsScreen() {
  return (
    <View style={styles.container}>
      <Text>PastWorkoutsScreen</Text>
      <TableRow />
      <IncompleteRow />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: "100%",
    backgroundColor: "black",
  },
});
