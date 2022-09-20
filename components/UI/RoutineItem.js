import { View, Text, StyleSheet } from "react-native";
import React from "react";

export default function RoutineItem({ routineName, exercises }) {
  return (
    <View style={styles.container}>
      <Text>{routineName}</Text>
      {exercises.map((exercise) => {
        return <Text>{exercise.exerciseName}</Text>;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "red",
    margin: 5,
    minWidth: "50%",
  },
});
