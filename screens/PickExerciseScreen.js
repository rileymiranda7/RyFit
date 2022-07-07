import { useState } from "react";
import { View, Text, Button, TextInput } from "react-native";

export default function PickExerciseScreen({ navigation }) {
  const [exerciseNameInput, onChangeText] = useState();

  function submitPickedExerciseHandler() {
    navigation.navigate("CurrentWorkoutScreen", {
      exerciseName: exerciseNameInput,
    });
  }

  return (
    <View>
      <Text>PickExerciseScreen</Text>
      <TextInput onChangeText={onChangeText} value={exerciseNameInput} />
      <Button title="Add Exercise" onPress={submitPickedExerciseHandler} />
    </View>
  );
}
