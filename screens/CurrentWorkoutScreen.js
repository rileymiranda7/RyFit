import { View, Text, Button, StyleSheet } from "react-native";
import React, { useState } from "react";

import ActiveWorkout from "../components/ActiveWorkout";
import Exercise from "../components/Exercise";
import Exercise2 from "../components/Exercise2";

export default function CurrentWorkoutScreen({ navigation }) {
  /* const [workoutInProgress, setWorkoutInProgress] = useState(false);

  function beginWorkoutPressedHandler() {
    setWorkoutInProgress((workoutInProgress) => !workoutInProgress);
  }

  let workoutNotStartedScreen = (
    <View>
      <Text>No workout in progress.</Text>
      <Button title="Begin Workout" onPress={beginWorkoutPressedHandler} />
    </View>
  );

  let workoutInProgressScreen = (
    <View>
      <Text>Workout in progress</Text>
      <ActiveWorkout />
    </View>
  );

  return (
    <View>
      {workoutInProgress ? workoutInProgressScreen : workoutNotStartedScreen}
    </View>
  ); */

  return (
    <View style={styles.container}>
      <ActiveWorkout />
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
