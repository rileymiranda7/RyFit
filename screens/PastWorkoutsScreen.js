import { View, Text, StyleSheet } from "react-native";
import { Col, Row, Grid } from "react-native-easy-grid";

export default function PastWorkoutsScreen() {
  return (
    <View style={styles.container}>
      <Text style={{ color: "white" }}>Past workouts</Text>
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
