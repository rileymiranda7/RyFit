import { View, Text, Button } from "react-native";
import React from "react";

export default function StartWorkoutScreen({ navigation }) {
  function beginWorkoutPressedHandler() {
    navigation.navigate("CurrentWorkout", {
      workoutInProgress: true,
    });
  }

  return (
    <View>
      <Text>StartWorkoutScreen</Text>
      <Button title="Begin Workout" onPress={beginWorkoutPressedHandler} />
    </View>
  );
}
