import { View, Text, StyleSheet } from "react-native";
import { Colors } from "../../../../constants/colors";

export default function Previous({ previous }) {

  let renderThis;

  if (previous.weight !== "" && previous.reps !== "") {
    renderThis = (
      <Text style={styles.text}>
        {previous.weight + " x " + previous.reps}
      </Text>
    );
  } else {
    renderThis = (
      <Text style={styles.text}>-</Text>
    );
  }

  return (
    <View style={styles.container}>
      {renderThis}
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
