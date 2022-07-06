import { View, Text, Button } from "react-native";
import React, { useState } from "react";

import ActiveWorkout from "../components/ActiveWorkout";

export default function CurrentWorkoutScreen() {
  const [workoutInProgress, setWorkoutInProgress] = useState(false);

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
  );
}
