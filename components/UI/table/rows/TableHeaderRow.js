import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "../../../../constants/colors";
import TableColumnHeader from "../row-elements/TableColumnHeader";

export default function TableHeaderRow() {
  return (
    <View style={styles.container}>
      <Text style={styles.set}>Set</Text>
      <Text style={styles.previous}>Previous</Text>
      <Text style={styles.lbs}>lbs</Text>
      <Text style={styles.reps}>Reps</Text>
      <View style={styles.completed}>
        <Ionicons name="checkbox" size={24} color="white" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    minWidth: "100%",
    backgroundColor: Colors.gray0,
    marginVertical: 4,
  },
  set: {
    textAlign: "center",
    flex: 2,
    backgroundColor: "red",
  },
  previous: {
    textAlign: "center",
    flex: 3,
    backgroundColor: "blue",
  },
  lbs: {
    flex: 2,
    textAlign: "center",
    backgroundColor: "orange",
  },
  reps: {
    flex: 2,
    textAlign: "center",
    backgroundColor: "green",
  },
  completed: {
    flex: 1,
    backgroundColor: "gold",
    alignItems: "center",
  },
});
