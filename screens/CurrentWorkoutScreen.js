import { View, Text } from "react-native";
import React, { useState } from "react";

export default function CurrentWorkoutScreen() {
  const [workoutInProgress, setWorkoutInProgress] = useState(false);

  return (
    <View>
      <Text>CurrentWorkoutScreen</Text>
    </View>
  );
}
