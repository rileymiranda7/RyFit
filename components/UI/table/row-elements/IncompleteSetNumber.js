import { View, Text, StyleSheet } from "react-native";

import { Colors } from "../../../../constants/colors";

export default function IncompleteSetNumber({ children }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 6,
    backgroundColor: Colors.gray0,
    width: 40,
  },
  text: {
    color: "white",
    fontSize: 16,
    padding: 4,
    textAlign: "center",
  },
});
