import { View, Text, Button, StyleSheet, Pressable } from "react-native";
import React, { useState, useLayoutEffect } from "react";

import ActiveWorkout from "../components/ActiveWorkout";
import Exercise from "../components/Exercise";
import SetTimerModal from "../components/UI/SetTimerModal";

export default function CurrentWorkoutScreen({ handleOnSetCompleted }) {
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
      <ActiveWorkout handleOnSetCompleted={handleOnSetCompleted} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: "100%",
    backgroundColor: "black",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
  },
});
