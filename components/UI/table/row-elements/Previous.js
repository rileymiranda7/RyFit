import { View, Text, StyleSheet } from "react-native";
import { Colors } from "../../../../constants/colors";

export default function Previous() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Previous</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.gray0,
    padding: 4,
    borderRadius: 6,
    minWidth: 100,
  },
  text: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
  },
});
