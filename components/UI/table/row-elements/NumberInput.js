import { View, TextInput, StyleSheet } from "react-native";
import { Colors } from "../../../../constants/colors";

export default function NumberInput() {
  return (
    <View>
      <TextInput
        style={styles.input}
        keyboardType="decimal-pad"
        placeholder=""
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: Colors.gray0,
    padding: 4,
    borderRadius: 6,
    color: "white",
    minWidth: 50,
    textAlign: "center",
    fontSize: 16,
  },
});
