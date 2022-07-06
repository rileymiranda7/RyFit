import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import IncompleteSetNumber from "./row/IncompleteSetNumber";
import NumberInput from "./row/NumberInput";
import Previous from "./row/Previous";

export default function IncompleteRow() {
  return (
    <View style={styles.container}>
      <IncompleteSetNumber>{"  1  "}</IncompleteSetNumber>
      <Previous />
      <NumberInput />
      <NumberInput />
      <Ionicons name="checkbox" size={24} color="white" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    minWidth: "100%",
    backgroundColor: "black",
    marginVertical: 4,
  },
});
