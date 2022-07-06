import { View, Text, StyleSheet } from "react-native";
import { Col, Row, Grid } from "react-native-easy-grid";

import IncompleteSetNumber from "../components/UI/table/row/IncompleteSetNumber";
import IncompleteRow from "../components/UI/table/IncompleteRow";
import Exercise from "../components/Exercise";

export default function PastWorkoutsScreen() {
  return (
    <View style={styles.container}>
      <Exercise exerciseName={"Barbell Bench Press"} />
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
