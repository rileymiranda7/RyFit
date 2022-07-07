import { View, Text, StyleSheet } from "react-native";
import { Colors } from "../../../../constants/colors";

export default function Previous() {
  return (
    <View style={styles.container}>
      <Text>Previous</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.gray0,
    padding: 4,
    borderRadius: 6,
    color: "white",
    minWidth: 100,
  },
});
