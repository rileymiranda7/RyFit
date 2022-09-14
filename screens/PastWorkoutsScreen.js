import { useIsFocused } from "@react-navigation/native";
import { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Col, Row, Grid } from "react-native-easy-grid";

import { fetchPastWorkouts } from "../utils/database";

export default function PastWorkoutsScreen() {
  const isFocused = useIsFocused();

  useEffect(() => {
    async function loadPastWorkouts() {
      await fetchPastWorkouts();
    }

    if (isFocused) {
      loadPastWorkouts();
    }
  }, [isFocused]);

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
