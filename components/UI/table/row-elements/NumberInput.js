import { View, TextInput, StyleSheet } from "react-native";
import { Colors } from "../../../../constants/colors";

export default function NumberInput({ textInputConfig, isFocused }) {
  return (
    <View>
      <TextInput 
        style={[
          styles.input, 
          isFocused && {
            borderWidth: 1,
            borderColor: "white"
          }]} 
        {...textInputConfig} />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: Colors.gray0,
    padding: 4,
    borderRadius: 6,
    color: "white",
    minWidth: 65,
    textAlign: "center",
    fontSize: 16,
  },
});
