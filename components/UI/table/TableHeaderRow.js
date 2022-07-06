import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "../../../constants/colors";
import TableColumnHeader from "./row/TableColumnHeader";

export default function TableRow() {
  return (
    <View style={styles.container}>
      <TableColumnHeader>Set#</TableColumnHeader>
      <TableColumnHeader>Previous</TableColumnHeader>
      <TableColumnHeader>lbs</TableColumnHeader>
      <TableColumnHeader>Reps</TableColumnHeader>
      <Ionicons name="checkbox" size={24} color="white" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    minWidth: "100%",
    backgroundColor: Colors.gray0,
    marginVertical: 4,
  },
});
